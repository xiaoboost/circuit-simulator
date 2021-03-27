import { Point, Matrix } from 'src/math';
import { LineWay } from './line-way';

/** 器件类型枚举常量 */
export const enum ElectronicKind {
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
export interface Content {
  id: number;
  mark: number;
}

/** 导线数据 */
export interface LineData {
  paths: LineWay;
  contents: Content[];
}

/** 器件数据 */
export interface PartData {
  rotate: Matrix;
  position: Point;
  connect: Content[];
}
