import type { CircuitData } from 'src/store';

export const data: CircuitData = {
  simulation: {
    end: '20m',
    step: '10u',
  },
  oscilloscopes: [
    ['V_R4'],
    ['I_R4'],
  ],
  electronics: [
    {
      kind: 'Resistance',
      id: 'R_1',
      params: ['10k'],
      position: [860, 180],
      rotate: [[0, 1], [-1, 0]],
    },
    {
      kind: 'Resistance',
      id: 'R_2',
      params: ['5k'],
      position: [860, 380],
      rotate: [[0, 1], [-1, 0]],
    },
    {
      kind: 'Resistance',
      id: 'R_3',
      params: ['1k'],
      position: [960, 280],
      rotate: [[1, 0], [0, 1]],
    },
    {
      kind: 'Resistance',
      id: 'R_4',
      params: ['5k'],
      position: [1060, 180],
      rotate: [[0, 1], [-1, 0]],
    },
    {
      kind: 'Resistance',
      id: 'R_5',
      params: ['10k'],
      position: [1060, 380],
      rotate: [[0, 1], [-1, 0]],
    },
    {
      kind: 'AcVoltageSource',
      id: 'V_1',
      params: ['50', '50', '0', '0'],
      position: [740, 280],
      rotate: [[1, 0], [0, 1]],
    },
    {
      kind: 'VoltageMeter',
      id: 'V_R4',
      position: [1160, 180],
      rotate: [[1, 0], [0, 1]],
    },
    {
      kind: 'CurrentMeter',
      id: 'I_R4',
      position: [960, 100],
      rotate: [[1, 0], [0, 1]],
    },
    {
      kind: 'ReferenceGround',
      id: 'GND_1',
      position: [740, 500],
      rotate: [[1, 0], [0, 1]],
    },
    {
      kind: 'Line',
      path: [[740, 240], [740, 100], [860, 100]],
    },
    {
      kind: 'Line',
      path: [[1060, 140], [1060, 100]],
    },
    {
      kind: 'Line',
      path: [[860, 100], [860, 140]],
    },
    {
      kind: 'Line',
      path: [[740, 320], [740, 460]],
    },
    {
      kind: 'Line',
      path: [[1060, 420], [1060, 460], [860, 460]],
    },
    {
      kind: 'Line',
      path: [[860, 460], [860, 420]],
    },
    {
      kind: 'Line',
      path: [[860, 220], [860, 280]],
    },
    {
      kind: 'Line',
      path: [[1060, 220], [1060, 280]],
    },
    {
      kind: 'Line',
      path: [[920, 280], [860, 280]],
    },
    {
      kind: 'Line',
      path: [[860, 280], [860, 340]],
    },
    {
      kind: 'Line',
      path: [[1000, 280], [1060, 280]],
    },
    {
      kind: 'Line',
      path: [[1060, 280], [1060, 340]],
    },
    {
      kind: 'Line',
      path: [[860, 100], [940, 100]],
    },
    {
      kind: 'Line',
      path: [[1160, 220], [1160, 280], [1060, 280]],
    },
    {
      kind: 'Line',
      path: [[740, 480], [740, 460]],
    },
    {
      kind: 'Line',
      path: [[740, 460], [860, 460]],
    },
    {
      kind: 'Line',
      path: [[980, 100], [1060, 100]],
    },
    {
      kind: 'Line',
      path: [[1060, 100], [1160, 100], [1160, 140]],
    },
  ],
};
