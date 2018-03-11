import { Electronic } from '../types';

const part: Electronic = {
    pre: 'IM',
    type: 'current_meter',
    introduction: '电流表',
    txtLBias: 11,
    padding: [0, 0, 0, 0],
    margin: [1, 1, 1, 1],
    params: [],
    points: [
        {
            position: [-20, 0],
            direction: [-1, 0],
        },
        {
            position: [20, 0],
            direction: [1, 0],
        },
    ],
    shape: [
        {
            name: 'path',
            attribute: {
                d: 'M-20,0H20',
            },
        },
        {
            name: 'polygon',
            attribute: {
                points: '12,0 2,-6 6,0 2,6', class: 'fill-black',
            },
        },
        {
            name: 'rect',
            attribute: {
                x: '-10', y: '-8', width: '20', height: '16', class: 'focus-transparent',
            },
        },
    ],
};

export default part;
