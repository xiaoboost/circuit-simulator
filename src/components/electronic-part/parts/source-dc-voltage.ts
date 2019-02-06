import { ElectronicPrototype, PartType } from './constant';

const part: ElectronicPrototype = {
    pre: 'V',
    type: PartType.DcVoltageSource,
    introduction: '直流电压源',
    txtLBias: 24,
    padding: [1, 1, 1, 1],
    margin: [1, 0, 1, 0],
    params: [
        {
            label: '电压值',
            unit: 'V',
            default: '12',
            vision: true,
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
                d: 'M0,-40V-5M0,5V40M-16,-5H16M-10.5,5H10.5M-10,-12H-5M-7.5,-15V-9',
            },
        },
        {
            name: 'rect',
            attribute: {
                x: '-16', y: '-30', width: '32', height: '60', class: 'focus-transparent',
            },
        },
    ],
};

export default part;
