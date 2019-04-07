import { CircuitStorage } from '../vuex';
import { PartType } from '../components/electronic-part';
import { LineType } from '../components/electronic-line';

export const data: CircuitStorage = {
    time: {
        end: '20m',
        step: '5u',
    },
    oscilloscopes: [
        ['V_in', 'V_out'],
        ['I_out'],
    ],
    data: [
        {
            type: PartType.AcVoltageSource,
            id: 'V_1',
            position: [140, 220],
            rotate: [[1, 0], [0, 1]],
            params: ['25', '50', '0', '0'],
        },
        {
            type: PartType.Diode,
            id: 'VD_1',
            position: [280, 140],
            rotate: [[0, 1], [-1, 0]],
            params: ['1', '0.5', '0.2G'],
        },
        {
            type: PartType.Resistance,
            id: 'R_1',
            position: [460, 220],
            rotate: [[0, 1], [-1, 0]],
            params: ['100'],
        },
        {
            type: PartType.ReferenceGround,
            id: 'GND_1',
            position: [320, 340],
            rotate: [[1, 0], [0, 1]],
        },
        {
            type: PartType.CurrentMeter,
            id: 'I_out',
            position: [400, 140],
            rotate: [[1, 0], [0, 1]],
        },
        {
            type: PartType.VoltageMeter,
            id: 'V_in',
            position: [200, 220],
            rotate: [[1, 0], [0, 1]],
            text: 'right',
        },
        {
            type: PartType.VoltageMeter,
            id: 'V_out',
            position: [520, 220],
            rotate: [[1, 0], [0, 1]],
            text: 'right',
        },
        {
            type: LineType.Line,
            way: [[140, 180], [140, 140], [200, 140]],
        },
        {
            type: LineType.Line,
            way: [[200, 180], [200, 140]],
        },
        {
            type: LineType.Line,
            way: [[200, 140], [240, 140]],
        },
        {
            type: LineType.Line,
            way: [[320, 140], [380, 140]],
        },
        {
            type: LineType.Line,
            way: [[420, 140], [460, 140]],
        },
        {
            type: LineType.Line,
            way: [[520, 180], [520, 140], [460, 140]],
        },
        {
            type: LineType.Line,
            way: [[460, 140], [460, 180]],
        },
        {
            type: LineType.Line,
            way: [[140, 260], [140, 300], [200, 300]],
        },
        {
            type: LineType.Line,
            way: [[200, 260], [200, 300]],
        },
        {
            type: LineType.Line,
            way: [[200, 300], [320, 300]],
        },
        {
            type: LineType.Line,
            way: [[320, 320], [320, 300]],
        },
        {
            type: LineType.Line,
            way: [[320, 300], [460, 300]],
        },
        {
            type: LineType.Line,
            way: [[520, 260], [520, 300], [460, 300]],
        },
        {
            type: LineType.Line,
            way: [[460, 300], [460, 260]],
        },
    ],
};
