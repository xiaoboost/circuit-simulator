import { ElectronicKind } from '../../types';
import { ElectronicPrototype } from '../types';

// 虚拟器件

// 无源器件
import { data as Capacitor } from './basic-capacitor';
import { data as Inductance } from './basic-inductance';
import { data as Resistance } from './basic-resistance';

// 电源
import { data as CurrentMeter } from './meter-current';
import { data as VoltageMeter } from './meter-voltage';
import { data as OperationalAmplifier } from './semi-amplifier';
import { data as Diode } from './semi-diode';
import { data as TransistorNpn } from './semi-transistor-npn';
import { data as AcVoltageSource } from './source-ac-voltage';
import { data as DcCurrentSource } from './source-dc-current';

// 测量器件

// 半导体器件
import { data as DcVoltageSource } from './source-dc-voltage';
import { data as ReferenceGround } from './virtual-ref-ground';

type Electronics = { [key in ElectronicKind]: ElectronicPrototype };

export const Electronics: Electronics = {
  [ElectronicKind.Line]: {} as any,
  [ElectronicKind.VoltageControlledVoltageSource]: {} as any,
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
