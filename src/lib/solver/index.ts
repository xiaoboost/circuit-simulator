import Matrix from 'src/lib/matrix';
import store from 'src/vuex';

import * as Mark from './mark';

import { numberParser } from 'src/lib/number';
import { LineData, LineType } from 'src/components/electronic-line';

import {
    PartData,
    PartRunData,
    Electronics,
    PartType,
    IterativeEquation,
    IteratorData,
} from 'src/components/electronic-part';

type HashMap = AnyObject<number>;
type ProgressHandler = (progress: number) => any | Promise<any>;

/** 观测器 */
export interface Observer {
    /** 观测器编号 */
    id: string;
    /** 观测矩阵 */
    matrix: Matrix;
    /** 输出数据 */
    data: number[];
}

/** 求解器 */
export default class Solver {
    /** 器件数据 */
    private parts: PartData[] = [];
    /** 导线数据 */
    private lines: LineData[] = [];
    /** 事件函数 */
    private events: ProgressHandler[] = [];

    /**
     * 处理之后的所有器件合集
     *  - 没有辅助器件
     *  - 没有可以继续拆分的器件
     */
    private partsAll: PartRunData[] = [];

    /** 系数矩阵 */
    private factor!: Matrix;
    /** 电源列向量 */
    private source!: Matrix;
    /** 迭代函数 */
    private update!: IterativeEquation;
    /** 电流观测器 */
    private observeCurrent: Observer[] = [];
    /** 电压观测器 */
    private observeVoltage: Observer[] = [];

    /** [管脚->节点号] 对应表 */
    private PinNodeMap: HashMap = {};
    /**
     * [管脚->支路号] 对应表
     *  - 在拆分器件之前，可能会有拥有三个或以上管脚的器件，经过拆分之后就没有这种器件存在的
     */
    private PinBranchMap: HashMap = {};

    /** 节点数量 */
    get nodeNumber() {
        return Math.max(...Object.values(this.PinNodeMap)) + 1;
    }
    /** 支路数量 */
    get branchNumber() {
        return Math.max(...Object.values(this.PinBranchMap)) + 1;
    }

    constructor(parts: PartData[], lines: LineData[]) {
        // 内部储存初始化
        this.parts = parts;
        this.lines = lines;
        this.PinNodeMap = {};
        this.PinBranchMap = {};

        // 状态初始化
        // 注：不可以调整以下函数的调用顺序
        this.setPinBranchMap();
        this.setPinNodeMap();
        this.splitParts();
        this.handleAttach();
        this.observeMeter();
        this.setCircuitMatrix();
    }

    /** 用 id 搜索器件或导线 */
    private findPart(id: string) {
        let result: PartData | LineData | undefined;

        if (/^line_/.test(id)) {
            result = this.lines.find((line) => line.id === id);
        }
        else {
            const [partId] = id.split('-');
            result = this.parts.find((part) => part.id === partId);
        }

        if (!result) {
            throw new Error(`未能找到该器件：${id}`);
        }

        return result;
    }

    /** 获取输入导线所在节点的所有导线和连接着的所有引脚 */
    private getNodeConnectByLine(id: string) {
        /** 入口导线 */
        const line = this.findPart(id) as LineData;
        /** 待访问的导线堆栈 */
        const temp = [line];

        /** 当前节点的所有导线堆栈 */
        const lines: LineData[] = [];
        /** 当前节点连接的所有器件引脚 */
        const partPins: string[] = [];

        // 搜索节点
        while (temp.length > 0) {
            const current = temp.pop()!;
            const connections = current.connect.join(' ').split(' ');

            // 记录当前导线
            lines.push(current);

            // 循环迭代当前导线所有的连接
            for (const pin of connections) {
                const item = this.findPart(pin);

                // 导线
                if (item.type === LineType.Line) {
                    if (
                        !temp.find((li) => li.id === item.id) &&
                        !lines.find((li) => li.id === item.id)
                    ) {
                        temp.push(item);
                    }
                }
                // 器件引脚
                else {
                    partPins.push(pin);
                }
            }
        }

        return { lines, partPins };
    }

    /** 由管脚到支路电流计算矩阵 */
    private getCurrentMatrixByPin(part: string) {
        const matrix = new Matrix(1, this.branchNumber, 0);
        matrix.set(0, this.PinBranchMap[part], 1);
        return matrix;
    }

    /** 由管脚到节点电压计算矩阵 */
    private getVoltageMatrixByPin(pin: string) {
        const matrix = new Matrix(1, this.nodeNumber, 0);
        matrix.set(0, this.PinNodeMap[pin], 1);
        return matrix;
    }

    /** 扫描所有导线，生成 [管脚->节点号] 对应表 */
    private setPinNodeMap() {
        const lineHash: AnyObject<boolean> = {};

        /** 节点编号，初始为 0 */
        let nodeNumber = 0;

        // 搜索所有导线
        for (const line of this.lines) {
            // 当前导线已经访问过了
            if (lineHash[line.id]) {
                continue;
            }

            // 当前节点的所有导线和引脚
            const { lines, partPins } = this.getNodeConnectByLine(line.id);

            // 标记已经搜索过的导线
            lines.forEach((item) => lineHash[item.id] = true);
            // 记录所有引脚连接节点的编号
            partPins.forEach((pin) => this.PinNodeMap[pin] = nodeNumber);

            // 每次循环就是个单独的节点
            nodeNumber++;
        }
    }

    /** 扫描所有器件，生成 [器件->支路号] 对应表 */
    private setPinBranchMap() {
        /** 支路编号，初始为 0 */
        let branchNumber = 0;

        for (const part of this.parts) {
            // 辅助器件，不建立支路
            if (
                part.type === PartType.CurrentMeter ||
                part.type === PartType.VoltageMeter ||
                part.type === PartType.ReferenceGround
            ) {
                continue;
            }

            // 一器件一支路
            this.PinBranchMap[part.id] = branchNumber++;
        }
    }

    /** 拆分所有能拆分的器件 */
    private splitParts() {
        this.parts.forEach((part, index) => {
            // 跳过辅助器件
            if (
                part.type === PartType.ReferenceGround ||
                part.type === PartType.CurrentMeter ||
                part.type === PartType.VoltageMeter
            ) {
                return;
            }

            // 器件原型
            const { apart } = Electronics[part.type];

            // 跳过不需要拆分的器件
            if (!apart) {
                this.partsAll.push(part);
                return;
            }

            const {
                interface: external,
                connect: internal,
                parts: insideParts,
            } = apart;

            const { PinNodeMap, PinBranchMap } = this;

            // 对外管脚号转换为内部标号
            for (let i = 0; i < external.length; i++) {
                const outsidePin = `${part.id}-${i}`;
                const mark = PinNodeMap[outsidePin];

                delete PinNodeMap[outsidePin];

                for (const pin of external[i]) {
                    PinNodeMap[`${part.id}-${pin}`] = mark;
                }
            }

            // 根据器件内部结构追加 PinNodeMap
            for (const node of internal) {
                const nodeNumber = this.nodeNumber + 1;

                for (const pin of node) {
                    PinNodeMap[`${part.id}-${pin}`] = nodeNumber;
                }
            }

            // 根据器件内部结构追加 PinBranchMap
            for (const insidePart of insideParts) {
                // 新器件编号
                const newId = `${part.id}-${insidePart.id}`;

                // 新器件入栈
                this.partsAll.push({
                    id: newId,
                    type: insidePart.type,
                    params: insidePart.params(part, Mark.getMark(index)),
                });

                PinBranchMap[newId] = this.branchNumber + 1;
            }
        });
    }

    /**
     * 处理辅助器件
     *  - 参考地，参考地所在节点全部标号为 -1
     *  - 电流表，合并电流表入口，删除节点表中记录
     *  - 电压表，不做处理（因为电压表相当于开路）
     */
    private handleAttach() {
        for (const part of this.parts) {
            // 参考地
            if (part.type === PartType.ReferenceGround) {
                const { PinNodeMap } = this;
                const GroundPin = `${part.id}-0`;
                const GroundNode = PinNodeMap[GroundPin];

                for (const pin of Object.keys(PinNodeMap)) {
                    // 标号比参考节点大的减 1
                    if (PinNodeMap[pin] > GroundNode) {
                        PinNodeMap[pin] -= 1;
                    }
                    // 参考节点为 -1
                    else if (PinNodeMap[pin] === GroundNode) {
                        PinNodeMap[pin] = -1;
                    }
                }

                delete PinNodeMap[GroundPin];
            }
            // 电流表
            else if (part.type === PartType.CurrentMeter) {
                const { PinNodeMap } = this;

                // 电流表两端节点编号
                const meterInput = `${part.id}-0`;
                const meterOutput = `${part.id}-1`;
                const nodeMin = Math.min(PinNodeMap[meterInput], PinNodeMap[meterOutput]);
                const nodeMax = Math.max(PinNodeMap[meterInput], PinNodeMap[meterOutput]);

                // 合并电流表两端节点（删除大的）
                for (const pin of  Object.keys(PinNodeMap)) {
                    if (PinNodeMap[pin] === nodeMax) {
                        PinNodeMap[pin] = nodeMin;
                    }
                    else if (PinNodeMap[pin] > nodeMax) {
                        PinNodeMap[pin]--;
                    }
                }

                // 节点对应表中删除记录
                delete PinNodeMap[meterInput];
                delete PinNodeMap[meterOutput];
            }
        }
    }

    /** 创建观测矩阵 */
    private observeMeter() {
        for (const meter of this.parts) {
            // 电流表
            if (meter.type === PartType.CurrentMeter) {
                const { partPins } = this.getNodeConnectByLine(meter.connect[0]);
                let matrix = new Matrix(1, this.branchNumber, 0);

                // 入口处所有支路的电流相加即为当前电流
                for (const pin of partPins) {
                    // 排除掉电流表入口本身
                    if (pin !== `${meter.id}-0`) {
                        matrix = matrix.add(this.getCurrentMatrixByPin(pin));
                    }
                }

                this.observeCurrent.push({
                    id: meter.id,
                    data: [],
                    matrix,
                });
            }
            // 电压表
            else if (meter.type === PartType.VoltageMeter) {
                const inputVoltage = this.getVoltageMatrixByPin(`${meter.id}-0`);
                const outputVoltage = this.getVoltageMatrixByPin(`${meter.id}-1`);

                // 输入减去输出即为当前电压表电压
                const matrix = inputVoltage.add(outputVoltage.factor(-1));

                this.observeVoltage.push({
                    id: meter.id,
                    data: [],
                    matrix,
                });
            }
        }
    }

    /** 创建电路系数矩阵 */
    private setCircuitMatrix() {
        const { nodeNumber, branchNumber } = this;

        /**
         * 关联矩阵
         *  - 一条支路连接于两个节点，则称该支路与这两个结点相关联
         *  - `A[j, k] = + 1`表示支路`k`与节点`j`关联，并且它的方向背离结点
         *  - `A[j, k] = - 1`表示支路`k`与节点`j`关联，并且它指向结点
         *  - `A[j, k] = 0`表示支路`k`与节点`j`无关联
         */
        const A = new Matrix(nodeNumber, branchNumber, 0);
        /** 导纳描述的电导电容矩阵 */
        const F = new Matrix(branchNumber);
        /** 阻抗描述的电阻电感矩阵 */
        const H = new Matrix(branchNumber);
        /** 独立电压电流源列向量 */
        const S = new Matrix(branchNumber, 1, 0);

        type IteratorCreator = IteratorData['createIterator'];
        type UpdateWarpper = (solver: Parameters<IteratorCreator>[0]) => ReturnType<IteratorCreator>;

        /** 迭代方程生成器的矩阵数据 */
        const updateMatrix = { A, F, H, S };
        /** 迭代方程包装器堆栈 */
        const updateWarppers: UpdateWarpper[] = [];
        /** 迭代方程组标记下标 */
        let updateIndex = 0;

        // 扫描所有器件，建立关联矩阵
        for (const part of this.partsAll) {
            for (let i = 0; i < 2; i++) {
                const node =  this.PinNodeMap[`${part.id}-${i}`];
                const branch = this.PinBranchMap[part.id];

                // 跳过参考节点
                if (node === -1) {
                    continue;
                }

                /**
                 * 此处划定的正方向统一为从引脚 0 指向引脚 1
                 * 则引脚 0 的关联矩阵值为 1，引脚 1 的关联矩阵值为 -1
                 */
                A.set(node, branch, Math.pow(-1, i));
            }
        }

        // 建立器件矩阵
        // 还未拆分并且有迭代方程的器件
        for (const part of this.parts) {
            const { apart, iterative } = Electronics[part.type];

            // 跳过无法拆分或者没有迭代方程的器件
            if (!apart || !iterative) {
                continue;
            }

            const mark = Mark.getMark(updateIndex++);

            // 此时标记的支路编号是无效的
            iterative.markInMatrix(updateMatrix, mark, -1);
            updateWarppers.push((solver) => iterative.createIterator(solver, part.params, mark));
        }

        // 拆分后的所有器件
        for (const part of this.partsAll) {
            /** 当前器件所在支路 */
            const branch = this.PinBranchMap[part.id];
            /** 当前的器件参数生成器 */
            const { constant, iterative } = Electronics[part.type];

            // 都不存在则报错
            if (!constant && !iterative) {
                throw new Error('该器件不存在 参数/常量 生成器');
            }
            // 常量参数
            else if (constant) {
                constant(updateMatrix, part.params, branch);
            }
            // 标记迭代参数
            else if (iterative) {
                const mark = Mark.getMark(updateIndex++);

                iterative.markInMatrix(updateMatrix, mark, branch);
                updateWarppers.push(
                    (solver) =>
                        iterative.createIterator(solver, part.params as string[], mark),
                );
            }
        }

        // 系数矩阵
        this.factor = Matrix.merge([
            [0,              0,     A],
            [A.transpose(), 'E',    0],
            [0,              F,     H],
        ]);

        // 电源列向量
        this.source = (
            new Matrix(A.row, 1, 0)
                .concatDown(new Matrix(A.column, 1, 0), S)
        );

        /** 迭代方程堆栈 */
        const updates = updateWarppers.map((func) => func({
            Factor: this.factor,
            Source: this.source,
        }));

        // 参数迭代方程包装
        this.update = (arg) => updates.forEach((cb) => cb(arg));
    }

    /** 设置进度条事件 */
    onProgress(event: ProgressHandler) {
        this.events.push(event);
    }

    /** 开始求解 */
    async startSolve() {
        // 终止和步长时间
        const { state: { time }} = store;
        const end = numberParser(time.end);
        const step = numberParser(time.step);

        /** 结点电压列向量 */
        let nodeVoltage = new Matrix(this.nodeNumber, 1, 0);
        /** 支路电流列向量 */
        let branchCurrent = new Matrix(this.branchNumber, 1, 0);
        /** 系数逆矩阵 */
        let factorInverse = this.factor.inverse();
        /** 当前时间 */
        let current = 0;

        // 迭代求解
        while (current <= end) {
            // 更新参数
            this.update({
                Voltage: nodeVoltage,
                Current: branchCurrent,
                time: end,
                interval: step,
            });

            // TODO: 系数矩阵更新，重新求逆
            if (false) {
                factorInverse = this.factor.inverse();
            }

            // 求解电路
            const result = factorInverse!.mul(this.source);

            // 更新列向量
            nodeVoltage = result.slice([0, 0], [this.nodeNumber - 1, 0]);
            branchCurrent = result.slice([this.nodeNumber + this.branchNumber, 0], [result.row - 1, 0]);

            // 记录观测电压值
            for (const ob of this.observeVoltage) {
                ob.data.push(ob.matrix.mul(nodeVoltage).get(0, 0));
            }

            // 记录观测电流值
            for (const ob of this.observeCurrent) {
                ob.data.push(ob.matrix.mul(branchCurrent).get(0, 0));
            }

            // 更新当前时间
            current += step;

            // 当前进度
            const progress = Math.round(current / end * 100);
            // 运行进度事件回调
            for (const ev of this.events) {
                await ev(progress);
            }
        }
    }
}
