import { Point } from '@circuit/algorithm';
import { ElectronicKind, ElectronicCategory } from './types';

/** 新建器件时的位置 */
export const NewElectronicPosition = Point.from([1e6, 1e6]);

/** 器件名称 */
export const ElectronicName: Record<ElectronicKind, string> = {
  [ElectronicKind.Resistance]: '电阻',
  [ElectronicKind.Inductance]: '电感',
  [ElectronicKind.Capacitor]: '电容',
  [ElectronicKind.CurrentMeter]: '电流测量',
  [ElectronicKind.VoltageMeter]: '电压测量',
  [ElectronicKind.OperationalAmplifier]: '运算放大器',
  [ElectronicKind.Diode]: '二极管',
  [ElectronicKind.TransistorNPN]: 'NPN 三极管',
  [ElectronicKind.AcVoltageSource]: '交流电压源',
  [ElectronicKind.DcCurrentSource]: '直流电流源',
  [ElectronicKind.DcVoltageSource]: '直流电压源',
  [ElectronicKind.ReferenceGround]: '参考地',
  [ElectronicKind.VoltageControlledVoltageSource]: '压控压源',
  [ElectronicKind.CurrentControlledCurrentSource]: '流控流源',
};

/** 器件分类名称 */
export const ElectronicCategoryName: Record<ElectronicCategory, string> = {
  [ElectronicCategory.Passive]: '无源器件',
  [ElectronicCategory.Meter]: '测量器件',
  [ElectronicCategory.Semiconductor]: '半导体器件',
  [ElectronicCategory.Power]: '电源',
  [ElectronicCategory.Virtual]: '虚拟器件',
};
