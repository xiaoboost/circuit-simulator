import { ElectronicKind } from '@circuit/shared';
import { IterativeCreation } from './types';

// 无源器件
import { data as Resistance } from './basic-resistance';
import { data as Capacitor } from './basic-capacitor';
import { data as Inductance } from './basic-inductance';

// 电源
import { data as DcVoltageSource } from './source-dc-voltage';
import { data as AcVoltageSource } from './source-ac-voltage';
import { data as DcCurrentSource } from './source-dc-current';
import { data as CurrentControlledCurrentSource } from './source-cccs';
import { data as VoltageControlledVoltageSource } from './source-vcvs';

// 半导体器件
import { data as Diode } from './semi-diode';
import { data as TransistorNpn } from './semi-transistor-npn';
import { data as OperationalAmplifier } from './semi-amplifier';

type Electronics = { [key in ElectronicKind]: IterativeCreation };

export * from './types';

export const Electronics: Electronics = {
  [ElectronicKind.Line]: () => void 0 as any,
  [ElectronicKind.ReferenceGround]: () => void 0 as any,
  [ElectronicKind.VoltageMeter]: () => void 0 as any,
  [ElectronicKind.CurrentMeter]: () => void 0 as any,

  [ElectronicKind.Resistance]: Resistance,
  [ElectronicKind.Capacitor]: Capacitor,
  [ElectronicKind.Inductance]: Inductance,
  [ElectronicKind.DcVoltageSource]: DcVoltageSource,
  [ElectronicKind.AcVoltageSource]: AcVoltageSource,
  [ElectronicKind.DcCurrentSource]: DcCurrentSource,
  [ElectronicKind.Diode]: Diode,
  [ElectronicKind.TransistorNPN]: TransistorNpn,
  [ElectronicKind.OperationalAmplifier]: OperationalAmplifier,
  [ElectronicKind.CurrentControlledCurrentSource]: CurrentControlledCurrentSource,
  [ElectronicKind.VoltageControlledVoltageSource]: VoltageControlledVoltageSource,
};
