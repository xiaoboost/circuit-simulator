// 虚拟器件
import reference_ground from './virtual-ref-ground';

// 无源器件
import resistance from './basic-resistance';
import capacitor from './basic-capacitor';
import inductance from './basic-inductance';

// 电源
import dc_voltage_source from './source-dc-voltage';
import ac_voltage_source from './source-ac-voltage';
import dc_current_source from './source-dc-current';

// 测量器件
import voltage_meter from './meter-voltage';
import current_meter from './meter-current';

// 半导体器件
import diode from './semi-diode';
import transistor_npn from './semi-transistor-npn';
import operational_amplifier from './semi-amplifier';

import { ElectronicPrototype, PartType } from './constant';

type Electronics = { [key in PartType]: ElectronicPrototype };
const Electronics: Electronics = {
    [PartType.Resistance]: resistance,
    [PartType.Capacitor]: capacitor,
    [PartType.Inductance]: inductance,
    [PartType.DcVoltageSource]: dc_voltage_source,
    [PartType.AcVoltageSource]: ac_voltage_source,
    [PartType.DcCurrentSource]: dc_current_source,
    [PartType.ReferenceGround]: reference_ground,
    [PartType.VoltageMeter]: voltage_meter,
    [PartType.CurrentMeter]: current_meter,
    [PartType.Diode]: diode,
    [PartType.TransistorNPN]: transistor_npn,
    [PartType.OperationalAmplifier]: operational_amplifier,
};

export * from './constant';

export default Electronics;
