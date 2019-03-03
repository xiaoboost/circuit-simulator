import { CircuitStorage } from '../vuex';
import { PartType } from '../components/electronic-part/parts';
import { LineType } from '../components/electronic-line/helper';

export const data: CircuitStorage = {
    data: [
        {
            type: PartType.Diode,
            id: 'VD_1',
            position: [300, 200],
            rotate: [[1, 0], [0, 1]],
            params: ['1', '0.5', '0.2G'],
        },
        {
            type: PartType.Diode,
            id: 'VD_2',
            position: [380, 200],
            rotate: [[1, 0], [0, 1]],
            params: ['1', '0.5', '0.2G'],
        },
        {
            type: PartType.Diode,
            id: 'VD_3',
            position: [300, 440],
            rotate: [[1, 0], [0, 1]],
            params: ['1', '0.5', '0.2G'],
        },
        {
            type: PartType.Diode,
            id: 'VD_4',
            position: [380, 440],
            rotate: [[1, 0], [0, 1]],
            params: ['1', '0.5', '0.2G'],
        },
        {
            type: PartType.AcVoltageSource,
            id: 'V_1',
            position: [180, 320],
            rotate: [[1, 0], [0, 1]],
            params: ['220', '200', '0', '0'],
        },
        {
            type: PartType.Capacitor,
            id: 'C_1',
            position: [500, 320],
            rotate: [[0, 1], [-1, 0]],
            params: ['100u'],
        },
        {
            type: PartType.Resistance,
            id: 'R_1',
            position: [560, 320],
            rotate: [[0, 1], [-1, 0]],
            params: ['2k'],
            text: 'right',
        },
        {
            type: PartType.Capacitor,
            id: 'I_out',
            position: [440, 140],
            rotate: [[1, 0], [0, 1]],
        },
        {
            type: PartType.VoltageMeter,
            id: 'V_out',
            position: [640, 320],
            rotate: [[1, 0], [0, 1]],
            text: 'right',
        },
        {
            type: PartType.VoltageMeter,
            id: 'V_in',
            position: [240, 320],
            rotate: [[1, 0], [0, 1]],
            text: 'right',
        },
        {
            type: PartType.ReferenceGround,
            id: 'GND_1',
            position: [300, 540],
            rotate: [[1, 0], [0, 1]],
        },
        {
            type: LineType.Line,
            way: [[180, 280], [180, 260], [240, 260]],
        },
        {
            type: LineType.Line,
            way: [[180, 360], [180, 380], [240, 380]],
        },
        {
            type: LineType.Line,
            way: [[300, 160], [300, 140], [380, 140]],
        },
        {
            type: LineType.Line,
            way: [[640, 280], [640, 140], [560, 140]],
        },
        {
            type: LineType.Line,
            way: [[640, 360], [640, 500], [560, 500]],
        },
        {
            type: LineType.Line,
            way: [[380, 240], [380, 380]],
        },
        {
            type: LineType.Line,
            way: [[380, 380], [380, 400]],
        },
        {
            type: LineType.Line,
            way: [[300, 400], [300, 260]],
        },
        {
            type: LineType.Line,
            way: [[300, 260], [300, 240]],
        },
        {
            type: LineType.Line,
            way: [[560, 280], [560, 140]],
        },
        {
            type: LineType.Line,
            way: [[380, 480], [380, 500]],
        },
        {
            type: LineType.Line,
            way: [[300, 480], [300, 500]],
        },
        {
            type: LineType.Line,
            way: [[380, 500], [500, 500]],
        },
        {
            type: LineType.Line,
            way: [[560, 360], [560, 500]],
        },
        {
            type: LineType.Line,
            way: [[500, 360], [500, 500]],
        },
        {
            type: LineType.Line,
            way: [[460, 140], [500, 140]],
        },
        {
            type: LineType.Line,
            way: [[500, 280], [500, 140]],
        },
        {
            type: LineType.Line,
            way: [[420, 140], [380, 140]],
        },
        {
            type: LineType.Line,
            way: [[380, 140], [380, 160]],
        },
        {
            type: LineType.Line,
            way: [[560, 140], [500, 140]],
        },
        {
            type: LineType.Line,
            way: [[560, 500], [500, 500]],
        },
        {
            type: LineType.Line,
            way: [[240, 280], [240, 260]],
        },
        {
            type: LineType.Line,
            way: [[240, 260], [300, 260]],
        },
        {
            type: LineType.Line,
            way: [[240, 360], [240, 380]],
        },
        {
            type: LineType.Line,
            way: [[240, 380], [380, 380]],
        },
        {
            type: LineType.Line,
            way: [[300, 520], [300, 500]],
        },
        {
            type: LineType.Line,
            way: [[300, 500], [380, 500]],
        },
    ],
};
