import * as utils from './utils';
import Matrix from 'src/lib/matrix';

import { PartData } from 'src/components/electronic-part/component';
import { default as Electronics, PartType } from 'src/components/electronic-part/parts';

import { LineData } from 'src/components/electronic-line/component';
import { LineType } from 'src/components/electronic-line/helper';

type HashMap = utils.HashMap;
type ProgressHandler = (progress: number) => void;

/** 观测器 */
interface Observer {
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
    parts: PartData[] = [];
    /** 导线数据 */
    lines: LineData[] = [];
    /** 事件函数 */
    events: ProgressHandler[] = [];

    /** 系数矩阵 */
    factor!: Matrix;
    /** 电源列向量 */
    source!: Matrix;
    /** 迭代函数 */
    update!: Function;
    /** 电流观测器 */
    observeCurrent: Observer[] = [];
    /** 电压观测器 */
    observeVoltage: Observer[] = [];

    /** [管脚->节点号] 对应表 */
    PinNodeMap: HashMap = {};
    /** [管脚->支路号] 对应表 */
    PinBranchMap: HashMap = {};

    /** 节点数量 */
    get nodeNumber() {
        return Math.max(...Object.values(this.PinNodeMap));
    }
    /** 支路数量 */
    get branchNumber() {
        return Math.max(...Object.values(this.PinBranchMap));
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

    /** 扫描所有导线，生成 [管脚->节点号] 对应表 */
    private setPinNodeMap() {
        const pinNodeMap: HashMap = {};
        const lineHash: AnyObject<boolean> = {};

        /** 节点数量，初始为 1 */
        let nodeNumber = 1;

        // 搜索所有导线
        for (const line of this.lines) {
            // 当前导线已经访问过了
            if (lineHash[line.id]) {
                continue;
            }

            // 临时导线堆栈
            const temp = [line];

            // 搜索当前导线构成的节点
            while (temp.length) {
                const current = temp.pop()!;
                const connections = current.connect.join(' ').split(' ');

                // 记录当前访问导线
                lineHash[current.id] = true;

                // 循环迭代当前导线所有的连接
                for (const id of connections) {
                    const item = this.findPart(id);

                    // 导线
                    if (item.type === LineType.Line) {
                        if (!temp.find((li) => li.id === id)) {
                            temp.push(item);
                        }
                    }
                    // 器件（此时的连接点是带引脚号的）
                    else {
                        pinNodeMap[id] = nodeNumber;
                    }
                }
            }

            // 一次 while 循环就是一个节点，节点数量 + 1
            nodeNumber++;
        }
    }

    /** 扫描所有器件，生成 [管脚->支路号] 对应表 */
    private setPinBranchMap() {
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

            const prototype = Electronics[part.type];

            // 一个器件一个支路
            for (let i = 0; i < prototype.points.length; i++) {
                this.PinBranchMap[`${part.id}-${i}`] = branchNumber;
            }

            branchNumber++;
        }
    }

    /** 拆分所有能拆分的器件 */
    private splitParts() {
        for (const part of this.parts) {
            // 器件原型
            const prototype = Electronics[part.type];

            // 跳过不需要拆分的器件
            if (!prototype.apart) {
                continue;
            }

            const {
                interface: external,
                connect: internal,
                parts: insideParts,
            } = prototype.apart;

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

            // 根据器件内部结构追加PinBranchMap
            for (const insidePart of insideParts) {
                const branchNumber = this.branchNumber + 1;
                const insidePrototype = Electronics[insidePart.type];

                for (let i = 0; i < insidePrototype.points.length; i++) {
                    PinBranchMap[`${part.id}-${insidePart.id}-${i}`] = branchNumber;
                }
            }
        }
    }

    /**
     * 处理辅助器件
     *  - 参考地，参考地所在节点全部标号为 0
     *  - 电流表，合并电流表入口，删除节点表中记录
     *  - 电压表，删除节点表中的记录
     */
    private handleAttach() {
        for (const part of this.parts) {
            // 参考地
            if (part.type === PartType.ReferenceGround) {
                const { PinNodeMap } = this;
                const GroundPin = `${part.id}-0`;
                const GroundNode = PinNodeMap[GroundPin];

                for (const pin of Object.keys(PinNodeMap)) {
                    // 标号比参考节点大的依次减1
                    if (PinNodeMap[pin] > GroundNode) {
                        PinNodeMap[pin]--;
                    }
                    // 参考节点为0
                    else {
                        PinNodeMap[pin] = 0;
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

                // 节点对应表中删除电流表
                delete PinNodeMap[meterInput];
                delete PinNodeMap[meterOutput];
            }
            // 电压表
            else if (part.type === PartType.VoltageMeter) {
                // 节点对应表中删除电流表
                delete this.PinNodeMap[`${part.id}-0`];
                delete this.PinNodeMap[`${part.id}-`];
            }
        }

        // TODO: 节点表和支路表值可能会变得稀疏，需要做整理
    }

    /** 创建观测矩阵 */
    private observeMeter() {

    }

    /** 创建电路系数矩阵 */
    private setCircuitMatrix() {

    }

    /** 创建参数迭代函数 */
    private setUpdateMethod() {

    }

    /** 设置求解器 */
    setSolver(parts: PartData[], lines: LineData[]) {
        // 内部储存初始化
        this.parts = parts;
        this.lines = lines;
        this.PinNodeMap = {};
        this.PinBranchMap = {};

        this.setPinNodeMap();
        this.setPinBranchMap();
        this.splitParts();
        this.handleAttach();
    }

    /** 设置进度条事件 */
    onProgress(event: ProgressHandler) {
        this.events.push(event);
    }

    /** 开始求解 */
    startSolve() {

    }
}
