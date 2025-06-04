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
