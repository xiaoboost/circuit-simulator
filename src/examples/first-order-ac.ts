import { CircuitStorage } from '../vuex';
import { PartType } from '../components/electronic-part';
import { LineType } from '../components/electronic-line';

export const data: CircuitStorage = {
    data: [
        {
            type: PartType.Resistance,
            id: 'R_1',
            position: [340, 200],
            rotate: [[1, 0], [0, 1]],
            params: ['200'],
        },
        {
            type: PartType.Capacitor,
            id: 'C_1',
            position: [420, 280],
            rotate: [[0, 1], [-1, 0]],
            params: ['10u'],
        },
        {
            type: PartType.ReferenceGround,
            id: 'GND_1',
            position: [340, 400],
            rotate: [[1, 0], [0, 1]],
        },
        {
            type: PartType.VoltageMeter,
            id: 'V_in',
            position: [260, 280],
            rotate: [[1, 0], [0, 1]],
        },
        {
            type: PartType.VoltageMeter,
            id: 'V_C1',
            position: [520, 280],
            rotate: [[1, 0], [0, 1]],
        },
        {
            type: PartType.AcVoltageSource,
            id: 'V_1',
            position: [160, 280],
            rotate: [[1, 0], [0, 1]],
            params: ['20', '100', '0', '0'],
        },
        {
            type: LineType.Line,
            way: [[380, 200], [420, 200]],
        },
        {
            type: LineType.Line,
            way: [[340, 380], [340, 360]],
        },
        {
            type: LineType.Line,
            way: [[340, 360], [420, 360]],
        },
        {
            type: LineType.Line,
            way: [[520, 240], [520, 200], [420, 200]],
        },
        {
            type: LineType.Line,
            way: [[420, 240], [420, 200]],
        },
        {
            type: LineType.Line,
            way: [[520, 320], [520, 360], [420, 360]],
        },
        {
            type: LineType.Line,
            way: [[420, 320], [420, 360]],
        },
        {
            type: LineType.Line,
            way: [[260, 240], [260, 200]],
        },
        {
            type: LineType.Line,
            way: [[260, 320], [260, 360]],
        },
        {
            type: LineType.Line,
            way: [[160, 240], [160, 200], [260, 200]],
        },
        {
            type: LineType.Line,
            way: [[260, 200], [300, 200]],
        },
        {
            type: LineType.Line,
            way: [[160, 320], [160, 360], [260, 360]],
        },
        {
            type: LineType.Line,
            way: [[260, 360], [340, 360]],
        },
    ],
};
