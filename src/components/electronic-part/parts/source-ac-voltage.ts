import { ElectronicPrototype } from './types';

const part: ElectronicPrototype = {
    pre: 'V',
    type: 'ac_voltage_source',
    introduction: '交流电压源',
    txtLBias: 24,
    padding: [1, 1, 1, 1],
    margin: [1, 0, 1, 0],
    params: [
        {
            label: '峰值电压',
            unit: 'V',
            default: '220',
            vision: true,
        },
        {
            label: '频率',
            unit: 'Hz',
            default: '50',
            vision: true,
        },
        {
            label: '偏置电压',
            unit: 'V',
            default: '0',
            vision: false,
        },
        {
            label: '初始相角',
            unit: '°',
            default: '0',
            vision: false,
        },
    ],
    points: [
        {
            position: [0, -40],
            direction: [0, -1],
        },
        {
            position: [0, 40],
            direction: [0, 1],
        },
    ],
    shape: [
        {
            name: 'circle',
            attribute: {
                cx: '0', cy: '0', r: '19', class: 'fill-white',
            },
        },
        {
            name: 'path',
            attribute: {
                d: 'M0,-40V-19.5M0,19.5V40M0,-16V-8M-4,-12H4M-4,15H4M-10,0Q-5,-10,0,0M0,0Q5,10,10,0',
            },
        },
        {
            name: 'rect',
            attribute: {
                x: '-20', y: '-30', width: '40', height: '60', class: 'focus-transparent',
            },
        },
    ],
};

export default part;
