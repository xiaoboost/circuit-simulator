import { ElectronicPrototype, PartType } from './constant';

const part: ElectronicPrototype = {
    pre: 'I',
    type: PartType.DcCurrentSource,
    introduction: '直流电流源',
    txtLBias: 24,
    padding: [1, 1, 1, 1],
    margin: [1, 0, 1, 0],
    params: [
        {
            label: '电流值',
            unit: 'A',
            default: '10',
            vision: true,
        },
    ],
    points: [
        {
            position: [0, 40],
            direction: [0, 1],
        },
        {
            position: [0, -40],
            direction: [0, -1],
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
                d: 'M0,-40V-20M0,20V40M0,-12V12',
            },
        },
        {
            name: 'polygon',
            attribute: {
                points: '0,-14 -5,-4 0,-8 5,-4', class: 'fill-black', // fill: '#3B4449', 'stroke-width': '0.5', 'stroke-linecap': 'square'
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
