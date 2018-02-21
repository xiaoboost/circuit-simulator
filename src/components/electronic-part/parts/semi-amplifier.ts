import { Electronic } from '../types';

const part: Electronic = {
    pre: 'OP',
    type: 'operational_amplifier',
    introduction: '运算放大器',
    // TODO: 文字需要位于器件中心
    txtLBias: 0,
    padding: [1, 0, 1, 0],
    margin: [1, 1, 1, 1],
    params: [
        {
            label: '开环增益',
            unit: 'dB',
            default: '120',
            vision: false,
        },
        {
            label: '输入电阻',
            unit: 'Ω',
            default: '80M',
            vision: false,
        },
        {
            label: '输出电阻',
            unit: 'Ω',
            default: '60',
            vision: false,
        },
        // {
        //     label: '截至频率',
        //     unit: 'Hz',
        //     default: '1M',
        //     vision: false,
        // },
    ],
    points: [
        {
            position: [-40, -20],
            direction: [-1, 0],
        },
        {
            position: [-40, 20],
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
                d: 'M-25,-35V35L25,0Z', class: 'fill-white',
            },
        },
        {
            name: 'path',
            attribute: {
                d: 'M-40,-20H-25M-40,20H-25M25,0H40',
            },
        },
        {
            name: 'path',
            attribute: {
                'd': 'M-22,-20H-16M-22,20H-16M-19,17V23', 'stroke-width': '1',
            },
        },
        {
            name: 'rect',
            attribute: {
                x: '-30', y: '-35', width: '60', height: '70',
            },
        },
    ],
};

export default part;
