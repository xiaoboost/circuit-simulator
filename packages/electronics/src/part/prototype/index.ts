import { ElectronicPrototype, ElectronicKind } from '@circuit/types';

// 无源器件
import { data as Capacitor } from './basic-capacitor';
import { data as Inductance } from './basic-inductance';
import { data as Resistance } from './basic-resistance';

// 测量器件
import { data as CurrentMeter } from './meter-current';
import { data as VoltageMeter } from './meter-voltage';

// 半导体器件
import { data as OperationalAmplifier } from './semi-amplifier';
import { data as Diode } from './semi-diode';
import { data as TransistorNpn } from './semi-transistor-npn';

// 电源
import { data as AcVoltageSource } from './source-ac-voltage';
import { data as DcCurrentSource } from './source-dc-current';
import { data as DcVoltageSource } from './source-dc-voltage';

// 虚拟器件
import { data as ReferenceGround } from './virtual-ref-ground';

type Electronics = { [key in ElectronicKind]: ElectronicPrototype };

export const Electronics: Electronics = {
  // TODO:
  [ElectronicKind.VoltageControlledVoltageSource]: {} as any,
  // TODO:
  [ElectronicKind.CurrentControlledCurrentSource]: {} as any,
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
