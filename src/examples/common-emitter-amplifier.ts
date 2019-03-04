import { CircuitStorage } from '../vuex';
import { PartType } from '../components/electronic-part';
import { LineType } from '../components/electronic-line';

export const data: CircuitStorage = {
    time: {
        end: '50m',
        step: '10u',
    },
    data: [
        {
            type: PartType.DcVoltageSource,
            id: 'V_1',
            position: [220, 100],
            rotate: [[0, 1], [-1, 0]],
            params: ['20'],
        },
        {
            type: PartType.ReferenceGround,
            id: 'GND_1',
            position: [140, 100],
            rotate: [[0, 1], [-1, 0]],
        },
        {
            type: PartType.Resistance,
            id: 'R_1',
            position: [300, 180],
            rotate: [[0, 1], [-1, 0]],
            params: ['100k'],
        },
        {
            type: PartType.Resistance,
            id: 'R_2',
            position: [300, 380],
            rotate: [[0, 1], [-1, 0]],
            params: ['100k'],
        },
        {
            type: PartType.Resistance,
            id: 'R_3',
            position: [400, 160],
            rotate: [[0, 1], [-1, 0]],
            params: ['10k'],
        },
        {
            type: PartType.Resistance,
            id: 'R_4',
            position: [400, 400],
            rotate: [[0, 1], [-1, 0]],
            params: ['2k'],
        },
        {
            type: PartType.TransistorNPN,
            id: 'Q_1',
            position: [380, 280],
            rotate: [[1, 0], [0, 1]],
            params: ['40', '26', '0.6', '1'],
        },
        {
            type: PartType.Resistance,
            id: 'R_5',
            position: [600, 340],
            rotate: [[0, 1], [-1, 0]],
            params: ['1M'],
        },
        {
            type: PartType.Capacitor,
            id: 'C_1',
            position: [500, 220],
            rotate: [[1, 0], [0, 1]],
            params: ['10n'],
        },
        {
            type: PartType.Capacitor,
            id: 'C_2',
            position: [240, 280],
            rotate: [[1, 0], [0, 1]],
            params: ['10μ'],
        },
        {
            type: PartType.AcVoltageSource,
            id: 'V_2',
            position: [120, 360],
            rotate: [[1, 0], [0, 1]],
            params: ['3', '300', '0', '0'],
        },
        {
            type: PartType.VoltageMeter,
            id: 'V_in',
            position: [180, 360],
            rotate: [[1, 0], [0, 1]],
            text: 'right',
        },
        {
            type: PartType.VoltageMeter,
            id: 'V_out',
            position: [660, 340],
            rotate: [[1, 0], [0, 1]],
            text: 'right',
        },
        {
            type: PartType.ReferenceGround,
            id: 'GND_2',
            position: [120, 500],
            rotate: [[1, 0], [0, 1]],
        },
        {
            type: LineType.Line,
            way: [[160, 100], [180, 100]],
        },
        {
            type: LineType.Line,
            way: [[260, 100], [300, 100]],
        },
        {
            type: LineType.Line,
            way: [[400, 120], [400, 100], [300, 100]],
        },
        {
            type: LineType.Line,
            way: [[300, 140], [300, 100]],
        },
        {
            type: LineType.Line,
            way: [[400, 240], [400, 220]],
        },
        {
            type: LineType.Line,
            way: [[400, 320], [400, 360]],
        },
        {
            type: LineType.Line,
            way: [[300, 220], [300, 280]],
        },
        {
            type: LineType.Line,
            way: [[300, 340], [300, 280]],
        },
        {
            type: LineType.Line,
            way: [[300, 280], [360, 280]],
        },
        {
            type: LineType.Line,
            way: [[540, 220], [600, 220]],
        },
        {
            type: LineType.Line,
            way: [[660, 300], [660, 220], [600, 220]],
        },
        {
            type: LineType.Line,
            way: [[600, 220], [600, 300]],
        },
        {
            type: LineType.Line,
            way: [[460, 220], [400, 220]],
        },
        {
            type: LineType.Line,
            way: [[400, 220], [400, 200]],
        },
        {
            type: LineType.Line,
            way: [[280, 280], [300, 280]],
        },
        {
            type: LineType.Line,
            way: [[180, 320], [180, 280]],
        },
        {
            type: LineType.Line,
            way: [[120, 320], [120, 280], [180, 280]],
        },
        {
            type: LineType.Line,
            way: [[180, 280], [200, 280]],
        },
        {
            type: LineType.Line,
            way: [[120, 480], [120, 460]],
        },
        {
            type: LineType.Line,
            way: [[180, 400], [180, 460]],
        },
        {
            type: LineType.Line,
            way: [[120, 400], [120, 460]],
        },
        {
            type: LineType.Line,
            way: [[300, 420], [300, 460]],
        },
        {
            type: LineType.Line,
            way: [[180, 460], [120, 460]],
        },
        {
            type: LineType.Line,
            way: [[400, 440], [400, 460]],
        },
        {
            type: LineType.Line,
            way: [[300, 460], [180, 460]],
        },
        {
            type: LineType.Line,
            way: [[600, 380], [600, 460]],
        },
        {
            type: LineType.Line,
            way: [[400, 460], [300, 460]],
        },
        {
            type: LineType.Line,
            way: [[660, 380], [660, 460], [600, 460]],
        },
        {
            type: LineType.Line,
            way: [[600, 460], [400, 460]],
        },
    ],
};
