import { ElectronicKind } from '../types';
import { Point, Direction, NumberRank, Matrix } from '@circuit/math';

/** 器件原始数据 */
export interface PartData {
  id: string;
  kind: keyof typeof ElectronicKind;
  position: number[];
  rotate?: number[][];
  text?: keyof typeof Direction;
  params?: string[];
}

/** 器件引脚状态 */
export interface PartPinStatus {
  /** 节点半径 */
  size?: number;
  /** 节点样式名称 */
  className?: string;
  /** 引脚下标 */
  index: number;
  /** 节点是否连接着导线 */
  isConnected: boolean;
  /** 原本节点相对器件原点位置 */
  origin: Point;
  /** 现在节点相对器件原点位置 */
  position: Point;
  /** 节点向外的延申方向 */
  direction: Point;
}

/** 器件参数单位枚举 */
export enum UnitType {
  /** 法拉 - 电容量 */
  Farad = 'F',
  /** 亨利 - 电感量 */
  Henry = 'H',
  /** 安培 - 电流量 */
  Ampere = 'A',
  /** 伏特 - 电压值 */
  Volt = 'V',
  /** 欧姆 - 电阻值 */
  Ohm = 'Ω',
  /** 赫兹 - 频率 */
  Hertz = 'Hz',
  /** 分贝 - 比例对数值 */
  Decibel = 'dB',
  /** 相位角 */
  Degree = '°',
  /** 无 - 没有单位 */
  Space = '',
}

/** 边距方向映射 */
export const MarginDirection = {
  [Direction.Top]: 0,
  [Direction.Right]: 1,
  [Direction.Bottom]: 2,
  [Direction.Left]: 3,
};

/** 器件每项参数的说明 */
export interface ParamsDescription {
  /** 该参数的文字描述 */
  readonly label: string;
  /** 该参数的物理单位 */
  readonly unit: UnitType;
  /** 该参数是否对外显示 */
  readonly vision: boolean;
  /** 该参数的初始默认值 */
  readonly default: string;
  /** 当前参数的快捷数量级选项 */
  readonly ranks?: NumberRank[];
}

/** 器件每个节点的描述 */
export interface PointDescription {
  /** 该节点距离器件中心点的相对位置 */
  readonly position: [number, number];
  /** 该节点对外延伸的方向 */
  readonly direction: Direction;
}

/** 外形元素描述 */
export interface ShapeDescription {
  /** DOM 元素名称 */
  readonly name: string;
  /** DOM 元素的所有属性 */
  readonly attribute: { [x: string]: string };
  /** 某些元素不可旋转 */
  readonly nonRotate?: true;
}

/** 描述电路的四个矩阵 */
interface CircuitBaseMatrix {
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
interface CircuitSolverMatrix {
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
export interface PartRunData extends Pick<any, 'id' | 'kind'> {
  /**
   * 运算时参数联合类型
   *  - 字符串为常量数字
   *  - 数字为标记数字
   */
  params: (string | number)[];
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
   * @param {number} mark 当前器件的标记编号
   */
  markInMatrix?(circuit: CircuitBaseMatrix, mark: number, branch: number): void;
  /**
   * 迭代方程生成器
   * @param {CircuitSolverMatrix} solver 求解器矩阵
   * @param {PartData | PartRunData} part 器件数据
   * @param {number} mark 当前器件的标记编号
   * @return {IterativeEquation} 迭代方程
   * TODO: 现在，有迭代方程的器件还没有需要运行时计算参数的
   */
  // createIterator(solver: CircuitSolverMatrix, part: PartData | PartRunData, mark: number): IterativeEquation;
  createIterator(
    solver: CircuitSolverMatrix,
    part: any | PartRunData, mark: number,
  ): IterativeEquation;
}

/**
 * 常量参数填充函数
 * @param {CircuitBaseMatrix} circuit 电路矩阵
 * @param {number} branch 当前器件所在支路编号
 * @param {number} params 当前器件的参数值们
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
   * @param {number} mark 完整器件的标记编号
   * @return {PartRunParams} 可运行的器件参数
   */
  params(part: PartRunData, mark: number): PartRunParams;
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
  connect: string[][];
  /**
   * 外部引脚对内的映射
   *  - 数组下标表示是当前器件的第几个引脚
   *  - 子数组表示连接至此引脚的内部器件引脚
   */
  interface: string[][];
}

/** 器件原型数据类型 */
export interface ElectronicPrototype {
  /** 器件编号的默认前置标记 */
  readonly pre: string;
  /** 器件种类 */
  readonly kind: ElectronicKind;
  /** 器件简述 */
  readonly introduction: string;
  /** 周围文字距离器件中心点的偏移量 */
  readonly txtLBias: number;
  /** 器件内边框范围（上、右、下、左） */
  readonly padding: readonly [number, number, number, number];
  /** 器件外边框范围（上、右、下、左） */
  readonly margin: readonly [number, number, number, number];
  /** 每项参数的描述 */
  readonly params: ParamsDescription[];
  /** 器件每个节点的描述 */
  readonly points: PointDescription[];
  /** 器件外形元素的描述 */
  readonly shape: ShapeDescription[];
  /** 迭代方程数据 */
  readonly iterative?: IteratorData;
  /** 常量参数生成器 */
  readonly constant?: ConstantCreation;
  /** 器件内部拆分描述 */
  readonly apart?: ElectronicApart;
}
