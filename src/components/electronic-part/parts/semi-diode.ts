import { Electronic } from '../types';

const part: Electronic = {
    pre: 'VD',
    type: 'diode',
    introduction: '二极管',
    txtLBias: 18,
    padding: [1, 0, 1, 0],
    margin: [1, 1, 1, 1],
    params: [
        {
            label: '导通电压',
            unit: 'V',
            default: '1',
            vision: false,
        },
        {
            label: '导通电阻',
            unit: 'Ω',
            default: '0.5',
            vision: false,
        },
        {
            label: '关断电阻',
            unit: 'Ω',
            default: '5M',
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
            name: 'path',
            attribute: {
                d: 'M0,-40V40M-13,-11H13',
            },
        },
        {
            name: 'polygon',
            attribute: {
                points: '0,-11 -13,11 13,11', class: 'fill-black', // fill: '#3B4449', 'stroke-width': '1'
            },
        },
        {
            name: 'rect',
            attribute: {
                x: '-13', y: '-30', width: '26', height: '60', class: 'focus-transparent',
            },
        },
    ],
};

export default part;
