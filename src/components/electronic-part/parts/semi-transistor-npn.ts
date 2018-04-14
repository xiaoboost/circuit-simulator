import { ElectronicPrototype } from '../types';

const part: ElectronicPrototype = {
    pre: 'Q',
    type: 'transistor_npn',
    introduction: 'NPN型三极管',
    txtLBias: 25,
    padding: [1, 0, 1, 0],
    margin: [1, 1, 1, 1],
    params: [
        {
            label: '电流放大倍数',
            unit: '',
            default: '40',
            vision: false,
        },
        {
            label: 'B极电阻',
            unit: 'Ω',
            default: '26',
            vision: false,
        },
        {
            label: 'BE饱和压降',
            unit: 'V',
            default: '0.6',
            vision: false,
        },
        {
            label: 'CE饱和压降',
            unit: 'V',
            default: '1',
            vision: false,
        },
    ],
    points: [
        {
            position: [-20, 0],
            direction: [-1, 0],
        },
        {
            position: [20, -40],
            direction: [0, -1],
        },
        {
            position: [20, 40],
            direction: [0, 1],
        },
    ],
    shape: [
        {
            name: 'path',
            attribute: {
                d: 'M-20,0H0M0,-25V25M20,-40V-28L0,-12M0,12L20,28V40',
            },
        },
        {
            name: 'polygon',
            attribute: {
                class: 'fill-black',
                points: '0,0 -11,-6 -7,0 -11,6',
                transform: 'translate(18, 26.4) rotate(38.7)',
            },
        },
        {
            name: 'rect',
            attribute: {
                x: '-10', y: '-30', width: '30', height: '60', class: 'focus-transparent',
            },
        },
    ],
};

export default part;