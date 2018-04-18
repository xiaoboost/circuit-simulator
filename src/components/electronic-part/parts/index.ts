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

const Electronics = {
    resistance,
    capacitor,
    inductance,
    dc_voltage_source,
    ac_voltage_source,
    dc_current_source,
    reference_ground,
    voltage_meter,
    current_meter,
    diode,
    transistor_npn,
    operational_amplifier,
};

type Electronics = typeof Electronics;

export * from './types';
export type PartTypes = keyof Electronics;

export default Electronics;
