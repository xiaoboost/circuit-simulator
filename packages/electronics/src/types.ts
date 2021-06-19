import type { Point } from '@circuit/math';

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

/** 引脚状态 */
export interface BasePinStatus {
  /** 节点半径 */
  size?: number;
  /** 节点样式名称 */
  className?: string;
  /** 引脚下标 */
  index: number;
  /** 节点是否连接着器件 */
  isConnected: boolean;
  /** 现在节点相对图纸原点位置 */
  position: Point;
}

/** 鼠标控制元素类名称 */
export const MouseFocusClassName = '_focus-transparent';
