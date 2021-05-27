import type { CircuitStorage } from 'src/store';

export const data: CircuitStorage = {
  electronics: [
    {
      kind: 'AcVoltageSource',
      position: [660, 240],
      rotate: [[0, 1], [-1, 0]],
      params: ['10', '200', '0', '0'],
    },
    {
      kind: 'OperationalAmplifier',
      position: [900, 220],
      rotate: [[1, 0], [0, 1]],
      params: ['120', '80M', '40'],
    },
    {
      kind: 'Resistance',
      position: [780, 240],
      rotate: [[1, 0], [0, 1]],
      params: ['10k'],
      text: 'Bottom',
    },
    {
      kind: 'ReferenceGround',
      position: [560, 240],
      rotate: [[0, 1], [-1, 0]],
    },
    {
      kind: 'VoltageMeter',
      position: [720, 320],
      rotate: [[1, 0], [0, 1]],
    },
    {
      kind: 'ReferenceGround',
      position: [720, 420],
      rotate: [[1, 0], [0, 1]],
    },
    {
      kind: 'Resistance',
      position: [900, 140],
      rotate: [[1, 0], [0, 1]],
      params: ['10k'],
    },
    {
      kind: 'Resistance',
      position: [780, 200],
      rotate: [[1, 0], [0, 1]],
      params: ['10k'],
    },
    {
      kind: 'ReferenceGround',
      position: [700, 200],
      rotate: [[0, 1], [-1, 0]],
    },
    {
      kind: 'Resistance',
      position: [960, 320],
      rotate: [[0, 1], [-1, 0]],
      params: ['10k'],
    },
    {
      kind: 'VoltageMeter',
      position: [1020, 320],
      rotate: [[1, 0], [0, 1]],
      text: 'Right',
    },
    {
      kind: 'Line',
      path: [[580, 240], [620, 240]],
    },
    {
      kind: 'Line',
      path: [[740, 240], [720, 240]],
    },
    {
      kind: 'Line',
      path: [[860, 240], [820, 240]],
    },
    {
      kind: 'Line',
      path: [[720, 280], [720, 240]],
    },
    {
      kind: 'Line',
      path: [[720, 240], [700, 240]],
    },
    {
      kind: 'Line',
      path: [[720, 400], [720, 380]],
    },
    {
      kind: 'Line',
      path: [[740, 200], [720, 200]],
    },
    {
      kind: 'Line',
      path: [[860, 200], [840, 200]],
    },
    {
      kind: 'Line',
      path: [[860, 140], [840, 140], [840, 200]],
    },
    {
      kind: 'Line',
      path: [[840, 200], [820, 200]],
    },
    {
      kind: 'Line',
      path: [[940, 140], [960, 140], [960, 220]],
    },
    {
      kind: 'Line',
      path: [[960, 280], [960, 220]],
    },
    {
      kind: 'Line',
      path: [[960, 220], [940, 220]],
    },
    {
      kind: 'Line',
      path: [[960, 360], [960, 380]],
    },
    {
      kind: 'Line',
      path: [[720, 380], [720, 360]],
    },
    {
      kind: 'Line',
      path: [[1020, 280], [1020, 220], [960, 220]],
    },
    {
      kind: 'Line',
      path: [[1020, 360], [1020, 380], [960, 380]],
    },
    {
      kind: 'Line',
      path: [[960, 380], [720, 380]],
    },
  ],
};
