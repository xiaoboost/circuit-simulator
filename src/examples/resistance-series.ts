import { CircuitStorage } from '../vuex';
import { PartType } from '../components/electronic-part';
import { LineType } from '../components/electronic-line';

export const data: CircuitStorage = {
    time: {
        end: '10m',
        step: '10u',
    },
    oscilloscopes: [
        ['I_in'],
        ['V_R1'],
    ],
    data: [
        {
            type: PartType.Resistance,
            id: 'R_1',
            position: [700, 160],
            rotate: [[0, 1], [-1, 0]],
            text: 'right',
            params: ['1k'],
        },
        {
            type: PartType.Resistance,
            id: 'R_2',
            position: [700, 320],
            rotate: [[0, 1], [-1, 0]],
            text: 'right',
            params: ['1k'],
        },
        {
            type: PartType.ReferenceGround,
            id: 'GND_1',
            position: [500, 420],
        },
        {
            type: PartType.VoltageMeter,
            id: 'V_R1',
            position: [780, 160],
            text: 'right',
        },
        {
            type: PartType.DcCurrentSource,
            id: 'V_1',
            position: [500, 180],
            text: 'right',
            params: ['10m'],
        },
        {
            type: PartType.DcVoltageSource,
            id: 'V_2',
            position: [500, 300],
            text: 'right',
            params: ['12'],
        },
        {
            type: PartType.CurrentMeter,
            id: 'I_in',
            position: [600, 100],
            text: 'top',
        },
        {
            type: LineType.Line,
            way: [[700, 120], [700, 100]],
        },
        {
            type: LineType.Line,
            way: [[780, 200], [780, 220], [700, 220]],
        },
        {
            type: LineType.Line,
            way: [[700, 200], [700, 220]],
        },
        {
            type: LineType.Line,
            way: [[700, 220], [700, 280]],
        },
        {
            type: LineType.Line,
            way: [[500, 400], [500, 380]],
        },
        {
            type: LineType.Line,
            way: [[500, 140], [500, 100], [580, 100]],
        },
        {
            type: LineType.Line,
            way: [[620, 100], [700, 100]],
        },
        {
            type: LineType.Line,
            way: [[700, 100], [780, 100], [780, 120]],
        },
        {
            type: LineType.Line,
            way: [[500, 340], [500, 380]],
        },
        {
            type: LineType.Line,
            way: [[500, 380], [700, 380], [700, 360]],
        },
        {
            type: LineType.Line,
            way: [[500, 260], [500, 220]],
        },
    ],
};
