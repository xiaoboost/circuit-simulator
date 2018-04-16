import { CircuitStorage } from './types';

const storage: CircuitStorage = {
    data: [
        {
            type: 'ac_voltage_source',
            id: 'V_1',
            position: [180, 220],
            rotate: [[1, 0], [0, 1]],
            params: ['20', '200', '0', '0'],
        },
        {
            type: 'diode',
            id: 'VD_1',
            position: [280, 140],
            rotate: [[0, 1], [-1, 0]],
            params: ['1', '0.5', '0.2G'],
        },
        {
            type: 'resistance',
            id: 'R_1',
            position: [460, 220],
            rotate: [[0, 1], [-1, 0]],
            params: ['100'],
        },
        {
            type: 'line',
            way: [[180, 180], [180, 140], [240, 140]],
        },
        {
            type: 'line',
            way: [[320, 140], [380, 140]],
        },
        {
            type: 'line',
            way: [[420, 140], [460, 140]],
        },
        {
            type: 'line',
            way: [[520, 180], [520, 140], [460, 140]],
        },
        {
            type: 'line',
            way: [[460, 140], [460, 180]],
        },
        {
            type: 'line',
            way: [[180, 260], [180, 300], [320, 300]],
        },
        {
            type: 'reference_ground',
            id: 'GND_1',
            position: [320, 340],
            rotate: [[1, 0], [0, 1]],
        },
        {
            type: 'line',
            way: [[320, 320], [320, 300]],
        },
        {
            type: 'line',
            way: [[320, 300], [460, 300]],
        },
        {
            type: 'line',
            way: [[520, 260], [520, 300], [460, 300]],
        },
        {
            type: 'line',
            way: [[460, 300], [460, 260]],
        },
        {
            type: 'current_meter',
            id: 'I_out',
            position: [400, 140],
            rotate: [[1, 0], [0, 1]],
        },
        {
            type: 'voltage_meter',
            id: 'V_out',
            position: [520, 220],
            rotate: [[1, 0], [0, 1]],
        },
    ],
};

export default storage;
