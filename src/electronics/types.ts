import { Point, Matrix } from 'src/math';
import { LineWay } from './line-way';

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
  id: number;
  mark: number;
}

/** 导线数据 */
export interface LineData {
  id: number;
  kind: ElectronicKind;
  path: LineWay;
  connects: Connect[];
}

/** 器件数据 */
export interface PartData {
  id: number;
  kind: ElectronicKind;
  rotate: Matrix;
  position: Point;
  connects: Connect[];
  params: string[];
}
