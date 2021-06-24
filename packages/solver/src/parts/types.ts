import type { Matrix } from '@circuit/math';
import type { ElectronicKind, ConnectionData } from '@circuit/electronics';

/** 描述电路的四个矩阵 */
export interface CircuitBaseMatrix {
  /** 关联矩阵 */
  A: Matrix;
  /** 电导电容矩阵 */
  F: Matrix;
  /** 电阻电感矩阵 */
  H: Matrix;
  /** 独立电压电流源列向量 */
  S: Matrix;
}

/** 描述电路求解器的两个矩阵 */
export interface CircuitSolverMatrix {
  /** 系数矩阵 */
  Factor: Matrix;
  /** 电源列向量 */
  Source: Matrix;
  /** 由管脚到节点电压计算矩阵 */
  getVoltageMatrixByPin(pin: string): Matrix;
  /** 由支路器件到支路电流计算矩阵 */
  getCurrentMatrixByBranch(branch: string): Matrix;
}

/** 迭代方程的运行参数 */
interface IterativeParameters {
  /** 电压列向量 */
  Voltage: Matrix;
  /** 电流列向量 */
  Current: Matrix;
  /** 当前时间 */
  time: number;
  /** 模拟步长 */
  interval: number;
}

/** 器件在运算时需要的数据 */
export interface PartRunData {
  id: string;
  kind: ElectronicKind;
  params: string[];
}

/** 运行时的器件参数列表 */
type PartRunParams = PartRunData['params'];
/** 迭代方程 */
export type IterativeEquation = (circuit: IterativeParameters) => void;

/** 器件迭代方程数据 */
export interface IteratorData {
  /**
   * 标记迭代方程输出值的位置
   * @param {CircuitBaseMatrix} circuit 电路矩阵
   * @param {number} branch 当前器件所在支路编号
   */
  mark?(circuit: CircuitBaseMatrix, branch: number): void;
  /**
   * 迭代方程生成器
   * @param {CircuitSolverMatrix} solver 求解器矩阵
   * @param {PartData | PartRunData} part 器件数据
   * @return {IterativeEquation} 迭代方程
   */
  create(solver: CircuitSolverMatrix, part: PartRunData): IterativeEquation;
}

/** 器件迭代方程生成器 */
export type IteratorCreation = () => IteratorData;

/**
 * 常量参数填充函数
 * @param {CircuitBaseMatrix} circuit 电路矩阵
 * @param {number} branch 当前器件所在支路编号
 * @param {number} params 当前器件的参数值
 */
export type ConstantCreation = (
  circuit: CircuitBaseMatrix,
  params: PartRunParams,
  branch: number,
) => void;

/** 可拆分器件的内部器件接口 */
interface PartInside {
  /** 器件内部编号 */
  id: string;
  /** 器件类型 */
  kind: ElectronicKind;
  /**
   * 生成当前器件参数
   * @param {PartRunData} part 完整器件数据
   * @return {PartRunParams} 可运行的器件参数
   */
  params(part: PartRunData): PartRunParams;
}

/**
 * 复杂器件的内部拆分
 *  - 拆分出来的器件必须是只有两个引脚的简单器件
 */
export interface ElectronicApart {
  /** 内部器件列表 */
  parts: PartInside[];
  /**
   * 拆分器件的连接
   *  - 每个元组即表示内部的一个节点
   */
  internal: ConnectionData[][];
  /**
   * 外部引脚对内的映射
   *  - 数组下标表示是当前器件的第几个引脚
   *  - 子数组表示连接至此引脚的内部器件引脚
   */
  external: ConnectionData[][];
}

/** 器件求解参数 */
export interface PartSolverData {
  /** 器件种类 */
  readonly kind: ElectronicKind;
  /** 迭代方程数据 */
  readonly iterative?: IteratorCreation;
  /** 常量参数生成器 */
  readonly constant?: ConstantCreation;
  /** 器件内部拆分描述 */
  readonly apart?: ElectronicApart;
}
