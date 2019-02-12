import { CircuitStorage } from '../vuex';
import { PartType } from '../components/electronic-part/parts';

export const data: CircuitStorage = {
    config: {
        end: '20m',
        step: '2u',
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
            params: ['10k'],
        },
        {
            type: PartType.Resistance,
            id: 'R_2',
            position: [300, 380],
            rotate: [[0, 1], [-1, 0]],
            params: ['10k'],
        },
        {
            type: PartType.Resistance,
            id: 'R_4',
            position: [400, 400],
            rotate: [[0, 1], [-1, 0]],
            params: ['680'],
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
            position: [600, 400],
            rotate: [[0, 1], [-1, 0]],
            params: ['100k'],
        },
        {
            type: PartType.Capacitor,
            id: 'C_1',
            position: [500, 340],
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
            params: ['3', '1k', '0', '0'],
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
            position: [660, 400],
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
            type: -1,
            way: [[160, 100], [180, 100]],
        },
        {
            type: -1,
            way: [[260, 100], [300, 100]],
        },
        {
            type: -1,
            way: [[400, 320], [400, 340]],
        },
        {
            type: -1,
            way: [[300, 220], [300, 280]],
        },
        {
            type: -1,
            way: [[300, 340], [300, 280]],
        },
        {
            type: -1,
            way: [[300, 280], [360, 280]],
        },
        {
            type: -1,
            way: [[280, 280], [300, 280]],
        },
        {
            type: -1,
            way: [[180, 320], [180, 280]],
        },
        {
            type: -1,
            way: [[120, 320], [120, 280], [180, 280]],
        },
        {
            type: -1,
            way: [[180, 280], [200, 280]],
        },
        {
            type: -1,
            way: [[120, 480], [120, 460]],
        },
        {
            type: -1,
            way: [[180, 400], [180, 460]],
        },
        {
            type: -1,
            way: [[120, 400], [120, 460]],
        },
        {
            type: -1,
            way: [[300, 420], [300, 460]],
        },
        {
            type: -1,
            way: [[180, 460], [120, 460]],
        },
        {
            type: -1,
            way: [[400, 440], [400, 460]],
        },
        {
            type: -1,
            way: [[300, 460], [180, 460]],
        },
        {
            type: -1,
            way: [[600, 440], [600, 460]],
        },
        {
            type: -1,
            way: [[400, 460], [300, 460]],
        },
        {
            type: -1,
            way: [[660, 440], [660, 460], [600, 460]],
        },
        {
            type: -1,
            way: [[600, 460], [400, 460]],
        },
        {
            type: -1,
            way: [[400, 240], [400, 100], [300, 100]],
        },
        {
            type: -1,
            way: [[300, 100], [300, 140]],
        },
        {
            type: -1,
            way: [[540, 340], [600, 340]],
        },
        {
            type: -1,
            way: [[660, 360], [660, 340], [600, 340]],
        },
        {
            type: -1,
            way: [[600, 340], [600, 360]],
        },
        {
            type: -1,
            way: [[460, 340], [400, 340]],
        },
        {
            type: -1,
            way: [[400, 340], [400, 360]],
        },
    ],
};
