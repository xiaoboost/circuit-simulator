import {
  Point,
  Position,
  Direction,
  NumberRank,
  RotateMatrix,
  DirectionLabel,
} from '@circuit/algorithm';

/** 器件原始数据 */
export interface PartStoreData {
  /** 器件编号 */
  id: string;
  /** 器件类别 */
  kind: ElectronicKind;
  /** 器件中心坐标 */
  position: Position;
  /** 器件参数 */
  params: string[];
  /** 器件旋转矩阵 */
  rotate?: RotateMatrix;
  /**
   * 文本方向
   *
   * @description 这个方向是器件本身的视角
   */
  textDirection: Direction;
}

/**
 * 边距
 *
 * @description 上右下左
 */
export type Margin = readonly [number, number, number, number];
/**
 * 边距顶点
 *
 * @description 左上角开始，顺时针
 */
export type MarginVertex = readonly [Point, Point, Point, Point];

/** 器件结构化数据 */
export type PartStructuredData = Required<PartStoreData>;

/** 器件引脚状态 */
export interface PartPinData {
  /** 原本节点相对器件原点位置 */
  origin: Point;
  /** 节点向外的延申方向 */
  direction: Point;
  /** 引脚下标 */
  index: number;
  /** 引脚相对图纸原点位置 */
  position: Point;
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
  /** 该参数的文字标题 */
  readonly label: string;
  /** 该参数的文字描述 */
  readonly description?: string;
  /** 该参数的物理单位 */
  readonly unit: UnitType;
  /** 该参数是否对外显示 */
  readonly visible: boolean;
  /** 该参数的初始默认值 */
  readonly default: string;
  /** 当前参数的快捷数量级选项 */
  readonly ranks?: NumberRank[];
}

/** 器件每个引脚的描述 */
export interface PinDescription {
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
  /** 不可旋转元素 */
  readonly nonRotate?: true;
}

/** 文本偏移量 */
export type TextBias = Partial<Record<DirectionLabel, number>>;

/** 器件原型系列 */
export enum ElectronicCategory {
  /** 无源器件 */
  Passive = 200,
  /** 测量器件 */
  Meter,
  /** 半导体器件 */
  Semiconductor,
  /** 电源 */
  Power,
  /** 虚拟器件 */
  Virtual,
}

/** 器件类型枚举常量 */
export enum ElectronicKind {
  /** 电阻 */
  Resistance,
  /** 电感 */
  Inductance,
  /** 电容 */
  Capacitor,
  /** 电流测量 */
  CurrentMeter,
  /** 电压测量 */
  VoltageMeter,
  /** 运算放大器 */
  OperationalAmplifier,
  /** 二极管 */
  Diode,
  /** npn 三极管 */
  TransistorNPN,
  /** 交流电压源 */
  AcVoltageSource,
  /** 直流电流源 */
  DcCurrentSource,
  /** 直流电压源 */
  DcVoltageSource,
  /** 参考地 */
  ReferenceGround,
  /** 压控压源 */
  VoltageControlledVoltageSource,
  /** 流控流源 */
  CurrentControlledCurrentSource,
}

/** 器件原型数据类型 */
export interface ElectronicPrototype {
  /** 器件编号的默认前置标记 */
  readonly pre: string;
  /** 器件种类 */
  readonly kind: ElectronicKind;
  /** 器件类别 */
  readonly category: ElectronicCategory;
  /** 周围文字距离器件中心点的偏移量 */
  readonly textBias?: TextBias;
  /** 器件内边框范围（上、右、下、左） */
  readonly padding: Margin;
  /** 器件外边框范围（上、右、下、左） */
  readonly margin: Margin;
  /** 每项参数的描述 */
  readonly params: ParamsDescription[];
  /** 器件每个节点的描述 */
  readonly pins: PinDescription[];
  /** 器件外形元素的描述 */
  readonly shape: ShapeDescription[];
  /** 器件聚焦区域的描述 */
  readonly focus: ShapeDescription[];
}
