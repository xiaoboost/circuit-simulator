import { ElectronicPrototype } from './types';

const part: ElectronicPrototype = {
    pre: 'L',
    type: 'inductance',
    introduction: '电感器',
    txtLBias: 13,
    padding: [0, 1, 0, 1],
    margin: [1, 1, 1, 1],
    params: [
        {
            label: '电感量',
            unit: 'H',
            default: '10u',
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
                d: 'M-40,0H-24M24,0H40M-24,0Q-18,-12,-12,0M-12,0Q-6,-12,0,0M0,0Q6,-12,12,0M12,0Q18,-12,24,0',
            },
        },
        {
            name: 'rect',
            attribute: {
                x: '-30', y: '-10', width: '60', height: '15', class: 'focus-transparent',
            },
        },
    ],
};

export default part;
