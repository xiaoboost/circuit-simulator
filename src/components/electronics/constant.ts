import { Point } from 'src/math';

/** 器件类型枚举常量 */
export enum ElectronicKind {
  /** 导线 */
  Line = 1,

  /** 电阻 */
  Resistance = 10,
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
}

/** 连接点数据 */
export interface Connect {
  id: string;
  mark: number;
}

/** 节点类型 */
export enum PointKind {
  Part,
  Line,
  LineCross,
}

/** 节点状态 */
export enum PointStatus {
  Open,
  Close,
}

/** 器件引脚状态 */
export interface PartPinStatus {
  /** 节点半径 */
  size?: number;
  /** 节点样式名称 */
  className?: string;
  /** 引脚标记 */
  label: string;
  /** 节点是否连接着导线 */
  isConnected: boolean;
  /** 原本节点相对器件原点位置 */
  origin: Point;
  /** 现在节点相对器件原点位置 */
  position: Point;
  /** 节点向外的延申方向 */
  direction: Point;
}

/** 导线引脚状态 */
export interface LinePinStatus {
  /** 节点半径 */
  size?: number;
  /** 节点样式名称 */
  className?: string;
  /** 引脚标记 */
  label: string;
  /** 节点是否连接着器件 */
  isConnected: boolean;
  /** 现在节点相对图纸原点位置 */
  position: Point;
}

/** 导线接触方块大小 */
export interface RectSize {
  x: number;
  y: number;
  height: number;
  width: number;
}
