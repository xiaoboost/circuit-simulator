import type { CircuitStorage } from 'src/store';

export const data: CircuitStorage = {
  time: {
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
      params: ['10k'],
      position: [860, 180],
      rotate: [[0, 1], [-1, 0]],
    },
    {
      kind: 'Resistance',
      params: ['5k'],
      position: [860, 380],
      rotate: [[0, 1], [-1, 0]],
    },
    {
      kind: 'Resistance',
      params: ['1k'],
      position: [960, 280],
      rotate: [[1, 0], [0, 1]],
    },
    {
      kind: 'Resistance',
      params: ['5k'],
      position: [1060, 180],
      rotate: [[0, 1], [-1, 0]],
    },
    {
      kind: 'Resistance',
      params: ['10k'],
      position: [1060, 380],
      rotate: [[0, 1], [-1, 0]],
    },
    {
      kind: 'AcVoltageSource',
      params: ['50', '50', '0', '0'],
      position: [740, 280],
      rotate: [[1, 0], [0, 1]],
    },
    {
      kind: 'VoltageMeter',
      position: [1160, 180],
      rotate: [[1, 0], [0, 1]],
    },
    {
      kind: 'CurrentMeter',
      position: [960, 100],
      rotate: [[1, 0], [0, 1]],
    },
    {
      kind: 'ReferenceGround',
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
