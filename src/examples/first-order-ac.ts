import { CircuitStorage } from './types';

// FIXME: 待修复
const storage: CircuitStorage = {
    data: [
        {
            type: 'resistance',
            id: 'R_1',
            position: [340, 200],
            rotate: [[1, 0], [0, 1]],
            params: ['200'],
        },
        {
            type: 'capacitor',
            id: 'C_1',
            position: [420, 280],
            rotate: [[0, 1], [-1, 0]],
            params: ['10u'],
        },
        {
            type: 'reference_ground',
            id: 'GND_1',
            position: [340, 400],
            rotate: [[1, 0], [0, 1]],
        },
        {
            type: 'voltage_meter',
            id: 'V_in',
            position: [260, 280],
            rotate: [[1, 0], [0, 1]],
        },
        {
            type: 'voltage_meter',
            id: 'V_C1',
            position: [520, 280],
            rotate: [[1, 0], [0, 1]],
        },
        {
            type: 'ac_voltage_source',
            id: 'V_1',
            position: [160, 280],
            rotate: [[1, 0], [0, 1]],
            params: ['20', '100', '0', '0'],
        },
        {
            type: 'line',
            way: [[380, 200], [420, 200]],
        },
        {
            type: 'line',
            way: [[340, 380], [340, 360]],
        },
        {
            type: 'line',
            way: [[340, 360], [420, 360]],
        },
        {
            type: 'line',
            way: [[520, 240], [520, 200], [420, 200]],
        },
        {
            type: 'line',
            way: [[420, 240], [420, 200]],
        },
        {
            type: 'line',
            way: [[520, 320], [520, 360], [420, 360]],
        },
        {
            type: 'line',
            way: [[420, 320], [420, 360]],
        },
        {
            type: 'line',
            way: [[260, 240], [260, 200]],
        },
        {
            type: 'line',
            way: [[260, 320], [260, 360]],
        },
        {
            type: 'line',
            way: [[160, 240], [160, 200], [260, 200]],
        },
        {
            type: 'line',
            way: [[260, 200], [300, 200]],
        },
        {
            type: 'line',
            way: [[160, 320], [160, 360], [260, 360]],
        },
        {
            type: 'line',
            way: [[260, 360], [340, 360]],
        },
    ],
};

export default storage;
