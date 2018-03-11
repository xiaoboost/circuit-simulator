import { Electronic } from '../types';

const part: Electronic = {
    pre: 'C',
    type: 'capacitor',
    introduction: '电容器',
    txtLBias: 22,
    padding: [0, 1, 0, 1],
    margin: [1, 1, 1, 1],
    params: [
        {
            label: '电容量',
            unit: 'F',
            default: '100u',
            vision: true,
        },
    ],
    points: [
        {
            position: [-40, 0],
            direction: [-1, 0],
        },
        {
            position: [40, 0],
            direction: [1, 0],
        },
    ],
    shape: [
        {
            name: 'path',
            attribute: {
                d: 'M5,0H40M-40,0H-5M-5,-16V16M5,-16V16',
            },
        },
        {
            name: 'rect',
            attribute: {
                x: '-30', y: '-15', width: '60', height: '30', class: 'focus-transparent',
            },
        },
    ],
};

export default part;
