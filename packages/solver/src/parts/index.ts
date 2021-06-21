import { ElectronicKind } from '@circuit/electronics';
import { PartSolverData } from './types';

// 虚拟器件
import { data as ReferenceGround } from './virtual-ref-ground';

// 无源器件
import { data as Resistance } from './basic-resistance';
import { data as Capacitor } from './basic-capacitor';
import { data as Inductance } from './basic-inductance';

// 电源
import { data as DcVoltageSource } from './source-dc-voltage';
import { data as AcVoltageSource } from './source-ac-voltage';
import { data as DcCurrentSource } from './source-dc-current';

// 测量器件
import { data as VoltageMeter } from './meter-voltage';
import { data as CurrentMeter } from './meter-current';

// 半导体器件
import { data as Diode } from './semi-diode';
import { data as TransistorNpn } from './semi-transistor-npn';
import { data as OperationalAmplifier } from './semi-amplifier';

type Electronics = { [key in ElectronicKind]: PartSolverData };

export * from './types';

export const Electronics: Electronics = {
  [ElectronicKind.Line]: {} as any,

  [ElectronicKind.Resistance]: Resistance,
  [ElectronicKind.Capacitor]: Capacitor,
  [ElectronicKind.Inductance]: Inductance,
  [ElectronicKind.DcVoltageSource]: DcVoltageSource,
  [ElectronicKind.AcVoltageSource]: AcVoltageSource,
  [ElectronicKind.DcCurrentSource]: DcCurrentSource,
  [ElectronicKind.ReferenceGround]: ReferenceGround,
  [ElectronicKind.VoltageMeter]: VoltageMeter,
  [ElectronicKind.CurrentMeter]: CurrentMeter,
  [ElectronicKind.Diode]: Diode,
  [ElectronicKind.TransistorNPN]: TransistorNpn,
  [ElectronicKind.OperationalAmplifier]: OperationalAmplifier,
};
