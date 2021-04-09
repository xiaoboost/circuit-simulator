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
      position: [460, 180],
      rotate: [[0, 1], [-1, 0]],
    },
    {
      kind: 'Resistance',
      params: ['5k'],
      position: [460, 380],
      rotate: [[0, 1], [-1, 0]],
    },
    {
      kind: 'Resistance',
      params: ['1k'],
      position: [560, 280],
      rotate: [[1, 0], [0, 1]],
    },
    {
      kind: 'Resistance',
      params: ['5k'],
      position: [660, 180],
      rotate: [[0, 1], [-1, 0]],
    },
    {
      kind: 'Resistance',
      params: ['10k'],
      position: [660, 380],
      rotate: [[0, 1], [-1, 0]],
    },
    {
      kind: 'AcVoltageSource',
      params: ['50', '50', '0', '0'],
      position: [340, 280],
      rotate: [[1, 0], [0, 1]],
    },
    {
      kind: 'VoltageMeter',
      position: [760, 180],
      rotate: [[1, 0], [0, 1]],
    },
    {
      kind: 'CurrentMeter',
      position: [560, 100],
      rotate: [[1, 0], [0, 1]],
    },
    {
      kind: 'ReferenceGround',
      position: [340, 500],
      rotate: [[1, 0], [0, 1]],
    },
    {
      kind: 'Line',
      path: [[340, 240], [340, 100], [460, 100]],
    },
    {
      kind: 'Line',
      path: [[660, 140], [660, 100]],
    },
    {
      kind: 'Line',
      path: [[460, 100], [460, 140]],
    },
    {
      kind: 'Line',
      path: [[340, 320], [340, 460]],
    },
    {
      kind: 'Line',
      path: [[660, 420], [660, 460], [460, 460]],
    },
    {
      kind: 'Line',
      path: [[460, 460], [460, 420]],
    },
    {
      kind: 'Line',
      path: [[460, 220], [460, 280]],
    },
    {
      kind: 'Line',
      path: [[660, 220], [660, 280]],
    },
    {
      kind: 'Line',
      path: [[520, 280], [460, 280]],
    },
    {
      kind: 'Line',
      path: [[460, 280], [460, 340]],
    },
    {
      kind: 'Line',
      path: [[600, 280], [660, 280]],
    },
    {
      kind: 'Line',
      path: [[660, 280], [660, 340]],
    },
    {
      kind: 'Line',
      path: [[460, 100], [540, 100]],
    },
    {
      kind: 'Line',
      path: [[760, 220], [760, 280], [660, 280]],
    },
    {
      kind: 'Line',
      path: [[340, 480], [340, 460]],
    },
    {
      kind: 'Line',
      path: [[340, 460], [460, 460]],
    },
    {
      kind: 'Line',
      path: [[580, 100], [660, 100]],
    },
    {
      kind: 'Line',
      path: [[660, 100], [760, 100], [760, 140]],
    },
  ],
};
