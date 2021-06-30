/** 器件类型枚举常量 */
export enum ElectronicKind {
  /** 导线 */
  Line = 1,

  // 实际器件
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

  // 虚拟器件
  /** 参考地 */
  ReferenceGround,
  /** 压控压源 */
  VoltageControlledVoltageSource,
  /** 流控流源 */
  CurrentControlledCurrentSource,
}
