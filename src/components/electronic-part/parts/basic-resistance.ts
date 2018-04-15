import { ElectronicPrototype } from './types';

const part: ElectronicPrototype = {
    pre: 'R',
    type: 'resistance',
    introduction: '电阻器',
    txtLBias: 14,
    padding: [0, 1, 0, 1],
    margin: [1, 1, 1, 1],
    params: [
        {
            label: '阻值',
            unit: 'Ω',
            default: '10k',
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
                d: 'M-40,0H-24L-20,-9L-12,9L-4,-9L4,9L12,-9L20,9L24,0H40',
            },
        },
        {
            name: 'rect',
            attribute: {
                x: '-30', y: '-13', width: '60', height: '26', class: 'focus-transparent',
            },
        },
    ],
};

export default part;
