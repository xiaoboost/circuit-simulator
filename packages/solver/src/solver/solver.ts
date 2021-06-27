import { concat, isNumber, AnyObject } from '@xiao-ai/utils';
import { Matrix, BigNumber, parseShortNumber } from '@circuit/math';
import { Part, Line, ElectronicKind, ConnectionData } from '@circuit/electronics';
import { stringifyInsidePart, stringifyInsidePin, stringifyPin } from '../utils/connection';
import { Mapping } from './map';

import {
  UpdateWrapper,
  Observer,
  SolveOption,
  ProgressEvent,
  SolverResult,
} from './types';

import {
  PartRunData,
  Electronics,
  IterativeEquation,
  PartRunDataWithIterator,
  CircuitBaseMatrix,
} from '../parts';

/** 求解器 */
export class Solver {
  /** 器件数据 */
  private parts: Part[] = [];
  /** 导线数据 */
  private lines: Line[] = [];
  /** 终止时间 */
  private end: string;
  /** 步进时间 */
  private step: string;
  /** 事件函数 */
  private onProgress?: ProgressEvent;

  /**
   * 处理之后的所有器件合集
   *  - 没有辅助器件
   *  - 没有可以继续拆分的器件
   */
  private partsAll: PartRunDataWithIterator[] = [];
  /** 迭代方程包装器堆栈 */
  private updateWrappers: UpdateWrapper[] = [];

  /** 系数矩阵 */
  factor!: Matrix;
  /** 电源列向量 */
  source!: Matrix;
  /** 电流观测器 */
  currentObservers: Observer[] = [];
  /** 电压观测器 */
  voltageObservers: Observer[] = [];
  /** [管脚->节点号] 对应表 */
  pinToNode = new Mapping();
  /**
   * [管脚->支路号] 对应表
   *  - 在拆分器件之前，可能会有拥有三个或以上管脚的器件，经过拆分之后就没有这种器件存在的
   */
  pinToBranch = new Mapping();

  constructor({
    parts,
    lines,
    end,
    step,
    onProgress,
  }: SolveOption) {
    this.parts = parts;
    this.lines = lines;
    this.end = end;
    this.step = step;
    this.onProgress = onProgress;

    this.getMapping();
    this.getObserveMatrix();
    this.getCircuitMatrix();
  }

  /** 用 id 搜索器件或导线 */
  private find<T extends Part | Line>(id: string): T {
    const result = (this.parts as T[]).concat(this.lines as T[]).find((item) => item.id === id);

    if (!result) {
      throw new Error(`未能找到该器件：${id}`);
    }

    return result;
  }

  /** 用 id 搜索运行时器件 */
  private findRunPart(id: string) {
    const result = this.partsAll.find((item) => item.id === id);

    if (!result) {
      throw new Error(`未能找到该器件：${id}`);
    }

    return result;
  }

  /** 获取输入导线所在节点的所有导线和连接着的所有引脚 */
  private getConnectionByLine(line: Line) {
    /** 待访问的导线堆栈 */
    const temp = [line];

    /** 当前节点的所有导线堆栈 */
    const lines: Line[] = [];
    /** 当前节点连接的所有器件引脚 */
    const connections: ConnectionData[] = [];

    // 搜索节点
    while (temp.length > 0) {
      const current = temp.pop()!;
      const currentConnections = concat(
        current.connections.map((item) => item.toData()),
        (item) => item,
      );

      // 记录当前导线
      lines.push(current);

      // 循环迭代当前导线所有的连接
      for (const pin of currentConnections) {
        const item = this.find(pin.id);

        if (!item) {
          continue;
        }
        else if (item.kind === ElectronicKind.Line) {
          if (
            !temp.find((li) => li.id === item.id) &&
            !lines.find((li) => li.id === item.id)
          ) {
            temp.push(item as Line);
          }
        }
        else {
          connections.push({ ...pin });
        }
      }
    }

    return { lines, connections };
  }

  /** 生成 [管脚->节点号] 对应表 */
  private getPinToNode() {
    const { pinToNode, lines } = this;
    const lineHash: AnyObject<boolean> = {};

    // 搜索所有导线
    for (const line of lines) {
      // 当前导线已经访问过了
      if (lineHash[line.id]) {
        continue;
      }

      // 当前节点的所有导线和引脚
      const { lines, connections } = this.getConnectionByLine(line);
      // 当前节点最大值
      const nodeNumber = pinToNode.max;

      // 记录当前导线
      lines.forEach(({ id }) => void (lineHash[id] = true));
      // 记录所有引脚连接节点的编号
      connections.forEach(
        (pin) =>
          pinToNode.set(stringifyPin(pin.id, pin.mark), nodeNumber),
      );
    }

    return pinToNode;
  }

  /** 生成 [器件->支路号] 对应表 */
  private getPinToBranch() {
    const { pinToBranch, parts } = this;

    for (const part of parts) {
      // 辅助器件，不建立支路
      if (
        part.kind === ElectronicKind.CurrentMeter ||
        part.kind === ElectronicKind.VoltageMeter ||
        part.kind === ElectronicKind.ReferenceGround
      ) {
        continue;
      }

      // 一器件一支路
      pinToBranch.set(part.id);
    }

    return pinToBranch;
  }

  /** 生成运行参数 */
  private getPartParams() {
    for (const part of this.parts) {
      if (
        part.kind === ElectronicKind.ReferenceGround ||
        part.kind === ElectronicKind.CurrentMeter ||
        part.kind === ElectronicKind.VoltageMeter
      ) {
        continue;
      }

      const { iterative } = Electronics[part.kind];

      if (!iterative) {
        throw new Error('非法器件')
      }

      const data = iterative(part);

      this.partsAll.push({
        id: part.id,
        params: part.params,
        kind: part.kind,
        iterative: data,
      });

      if (!data.apart) {
        continue;
      }

      const { pinToNode, pinToBranch, partsAll } = this;
      const { external, internal, parts: insideParts } = data.apart;

      // 对外管脚号转换为内部标号
      for (let i = 0; i < external.length; i++) {
        const outsidePin = stringifyPin(part.id, i);
        const mark = pinToNode.get(outsidePin);

        pinToNode.delete(outsidePin);

        for (const pin of external[i]) {
          pinToNode.set(stringifyInsidePin(part.id, pin), mark);
        }
      }

      // 根据器件内部结构追加 pinToNode
      for (const node of internal) {
        const mark = pinToNode.max;

        for (const pin of node) {
          pinToNode.set(stringifyInsidePin(part.id, pin), mark);
        }
      }

      // 根据器件内部结构追加 pinToBranch
      for (const insidePart of insideParts) {
        const newId = stringifyInsidePart(part.id, insidePart.id);
        const { iterative } = Electronics[insidePart.kind];

        if (!iterative) {
          throw new Error('非法器件');
        }

        const insidePartData: PartRunData = {
          id: newId,
          kind: insidePart.kind,
          params: insidePart.params,
        };

        // 新器件入栈
        partsAll.push({
          ...insidePartData,
          iterative: iterative(insidePartData),
        });

        // 标记当前器件
        pinToBranch.set(newId);
      }

      // 支路对应表中删除原器件
      pinToBranch.deleteValue(pinToBranch.get(part.id)!);
    }
  }

  /**
   * 删除辅助器件
   *  - 参考地，参考地所在节点全部标号为 -1
   *  - 电流表，合并电流表入口，删除节点表中记录
   *  - 电压表，不做处理（因为电压表相当于开路）
   */
  private deleteAuxiliary() {
    const { parts, pinToNode } = this;

    for (const part of parts) {
      // 参考地
      if (part.kind === ElectronicKind.ReferenceGround) {
        const groundPin = stringifyPin(part.id, 0);

        pinToNode.changeValue(pinToNode.get(groundPin)!, -1);
        pinToNode.delete(groundPin);
      }
      // 电流表
      else if (part.kind === ElectronicKind.CurrentMeter) {
        // 电流表两端节点编号
        const meterInput = stringifyPin(part.id, 0);
        const meterOutput = stringifyPin(part.id, 1);
        const nodeMin = Math.min(pinToNode.get(meterInput)!, pinToNode.get(meterOutput)!);
        const nodeMax = Math.max(pinToNode.get(meterInput)!, pinToNode.get(meterOutput)!);

        // 合并电流表两端节点（删除大的）
        pinToNode.changeValue(nodeMax, nodeMin);

        // 节点对应表中删除记录
        pinToNode.delete(meterInput);
        pinToNode.delete(meterOutput);
      }
    }
  }

  /** 由管脚到节点电压计算矩阵 */
  private getVoltageMatrixByPin(id: string, mark: number) {
    /** 电压矩阵 */
    const matrix = new Matrix(1, this.pinToNode.max, 0);
    /** 实际的器件管脚编号 */
    let realPin = stringifyPin(id, mark);

    // 未找到节点记录
    if (!this.pinToNode.has(realPin)) {
      /** 引脚器件 */
      const pinPart = this.findRunPart(id);
      /** 器件拆分原型 */
      const { apart } = pinPart.iterative;

      // 器件不可拆分，则抛出错误
      if (!apart) {
        throw new Error(`(Solver) 非法器件: ${pinPart.id}`);
      }

      realPin = stringifyInsidePin(pinPart.id, apart.external[mark][0]);
    }

    matrix.set(0, this.pinToNode.get(realPin)!, 1);

    return matrix;
  }

  /** 由支路器件到支路电流计算矩阵 */
  private getCurrentMatrixByBranch(id: string) {
    const { pinToBranch } = this;

    /** 电流矩阵 */
    const matrix = new Matrix(1, pinToBranch.max, 0);
    /** 支路器件 */
    const part = this.find(id);

    // 电流表
    // 因为电流表在电路中实际体现出来是短路（引脚节点是同一个编号），所以必须从导线搜索原始连接
    if (part && part.kind === ElectronicKind.CurrentMeter) {
      // 支路器件连接的导线
      const connectionLine = this.find<Line>(part.connections[1].value!.id);
      // 搜索电流表出口所连的所有器件
      const { connections } = this.getConnectionByLine(connectionLine);
      // 解析为器件（支路）编号，并排除掉其本身以及无效支路
      const branch = connections
        .map((pin) => pin.id)
        .filter(
          (branchName) =>
            branchName !== part.id &&
            pinToBranch.has(branchName),
        );

      branch.forEach((branchName) => matrix.set(0, pinToBranch.get(branchName)!, 1));
    }
    // 非电流表器件
    // 直接取支路电流即可
    else {
      matrix.set(0, pinToBranch.get(part.id)!, 1);
    }

    return matrix;
  }

  /** 生成映射表 */
  getMapping() {
    this.getPinToBranch();
    this.getPinToNode();
    this.getPartParams();
    this.deleteAuxiliary();

    return {
      pinToBranch: this.pinToBranch,
      pinToNode: this.pinToNode,
    };
  }

  /** 创建观测矩阵 */
  getObserveMatrix() {
    const {
      parts,
      currentObservers: current,
      voltageObservers: voltage,
    } = this;

    for (const meter of parts) {
      // 电流表
      if (meter.kind === ElectronicKind.CurrentMeter) {
        current.push({
          id: meter.id,
          data: [],
          matrix: this.getCurrentMatrixByBranch(meter.id),
        });
      }
      // 电压表
      else if (meter.kind === ElectronicKind.VoltageMeter) {
        const negativeVoltage = this.getVoltageMatrixByPin(meter.id, 0);
        const positiveVoltage = this.getVoltageMatrixByPin(meter.id, 1);

        // 正电极减去负电极，即为测量电压
        const matrix = positiveVoltage.add(negativeVoltage.factor(-1));

        voltage.push({
          id: meter.id,
          data: [],
          matrix,
        });
      }
    }

    return {
      currentObservers: current,
      voltageObservers: voltage,
    };
  }

  /** 创建电路系数矩阵 */
  getCircuitMatrix() {
    const { pinToNode, pinToBranch, updateWrappers } = this;
    const nodeNumber = pinToNode.max;
    const branchNumber = pinToBranch.max;

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
    /** 迭代方程生成器的矩阵数据 */
    const updateMatrix: CircuitBaseMatrix = {
      A,
      F,
      H,
      S,
      getBranchById: (id: string) => this.pinToBranch.get(id),
      getNodeById: (id: string) => this.pinToNode.get(id),
    };

    // 建立关联矩阵
    for (const part of this.partsAll) {
      for (let i = 0; i < 2; i++) {
        const node = pinToNode.get(stringifyPin(part.id, i));
        const branch = pinToBranch.get(part.id);

        // 跳过参考节点
        if (!isNumber(node) || !isNumber(branch) || node < 0 || branch < 0) {
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
    for (const part of this.partsAll) {
      const { constant, create } = part.iterative;

      if (constant) {
        constant(updateMatrix);
      }

      if (create) {
        updateWrappers.push((solver) => create(solver));
      }
    }

    // 系数矩阵
    this.factor = Matrix.merge([
      [0, 0, A],
      [A.transpose(), 'E', 0],
      [0, F, H],
    ]);

    // 电源列向量
    this.source = (
      new Matrix(A.row, 1, 0)
        .concatDown(new Matrix(A.column, 1, 0), S)
    );

    return {
      A, H, F, S,
      factor: this.factor,
      source: this.source,
    };
  }

  /** 求解电路 */
  async startSolve(): Promise<SolverResult> {
    // 终止和步长时间
    const end = parseShortNumber(this.end);
    const step = parseShortNumber(this.step);

    /** 电路常量 */
    const {
      onProgress,
      factor,
      source,
      voltageObservers,
      currentObservers,
      pinToNode: {
        max: nodeNumber,
      },
      pinToBranch: {
        max: branchNumber,
      },
    } = this;

    /** 结点电压列向量 */
    let nodeVoltage = new Matrix(nodeNumber, 1, 0);
    /** 支路电流列向量 */
    let branchCurrent = new Matrix(branchNumber, 1, 0);
    /** 当前模拟器的精确时间 */
    let current = new BigNumber(0);
    /** 当前模拟器的精确时间的缓存 */
    let currentCache = 0;
    /** 系数方程是否被更改 */
    let factorChange = false;
    /** 系数逆矩阵 */
    let factorInverse!: Matrix;

    /** 时间坐标数组 */
    const times = [currentCache];
    /** 系数矩阵代理 */
    const factorProxy = new Proxy(factor, {
      get(target, property) {
        // 代理 set 方法
        if (property === 'set') {
          return (...args: Parameters<Matrix['set']>) => {
            factorChange = true;
            target.set(...args);
          };
        }
        else {
          return target[property];
        }
      },
    });
    /** 迭代方程堆栈 */
    const updates = this.updateWrappers.map((func) => func({
      Factor: factorProxy,
      Source: this.source,
      getVoltageMatrixByPin: this.getVoltageMatrixByPin.bind(this),
      getCurrentMatrixByBranch: this.getCurrentMatrixByBranch.bind(this),
    }));
    /** 参数迭代方程包装 */
    const update: IterativeEquation = (arg) => updates.forEach((cb) => cb(arg));

    /** 上次时间 */
    let last = Date.now();

    // 迭代求解
    while (currentCache <= end) {
      // 标志位初始化
      factorChange = false;

      // 器件迭代
      update({
        Voltage: nodeVoltage,
        Current: branchCurrent,
        time: currentCache,
        interval: step,
      });

      // 若系数矩阵改变，就需要重新求逆
      if (!factorInverse || factorChange) {
        factorInverse = factor.inverse();
      }

      // 求解电路
      const result = factorInverse.mul(source);

      // 更新列向量
      nodeVoltage = result.slice([0, 0], [nodeNumber - 1, 0]);
      branchCurrent = result.slice([nodeNumber + branchNumber, 0], [result.row - 1, 0]);

      // 记录观测电压值
      for (const ob of voltageObservers) {
        ob.data.push(ob.matrix.mul(nodeVoltage).get(0, 0));
      }

      // 记录观测电流值
      for (const ob of currentObservers) {
        ob.data.push(ob.matrix.mul(branchCurrent).get(0, 0));
      }

      // 更新当前时间
      current = current.plus(step);
      currentCache = current.toNumber();

      // 时间坐标增加
      times.push(currentCache);

      /** 当前时间 */
      const now = Date.now();

      // 运行进度事件回调
      if (onProgress && now - last > 1000) {
        await onProgress(Math.round(currentCache / end * 10000) / 100);
        last = now;
      }
    }

    // 最后的时间元素无效
    times.pop();

    return {
      times,
      meters: this.voltageObservers
        .concat(this.currentObservers)
        .map(({ id, data }) => ({ id, data })),
    };
  }
}
