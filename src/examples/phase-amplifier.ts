import type { CircuitStorage } from 'src/store';

export const data: CircuitStorage = {
  electronics: [
    {
      kind: 'AcVoltageSource',
      position: [260, 240],
      rotate: [[0, 1], [-1, 0]],
      params: ['10', '200', '0', '0'],
    },
    {
      kind: 'OperationalAmplifier',
      position: [500, 220],
      rotate: [[1, 0], [0, 1]],
      params: ['120', '80M', '40'],
    },
    {
      kind: 'Resistance',
      position: [380, 240],
      rotate: [[1, 0], [0, 1]],
      params: ['10k'],
      text: 'Bottom',
    },
    {
      kind: 'ReferenceGround',
      position: [160, 240],
      rotate: [[0, 1], [-1, 0]],
    },
    {
      kind: 'VoltageMeter',
      position: [320, 320],
      rotate: [[1, 0], [0, 1]],
    },
    {
      kind: 'ReferenceGround',
      position: [320, 420],
      rotate: [[1, 0], [0, 1]],
    },
    {
      kind: 'Resistance',
      position: [500, 140],
      rotate: [[1, 0], [0, 1]],
      params: ['10k'],
    },
    {
      kind: 'Resistance',
      position: [380, 200],
      rotate: [[1, 0], [0, 1]],
      params: ['10k'],
    },
    {
      kind: 'ReferenceGround',
      position: [300, 200],
      rotate: [[0, 1], [-1, 0]],
    },
    {
      kind: 'Resistance',
      position: [560, 320],
      rotate: [[0, 1], [-1, 0]],
      params: ['10k'],
    },
    {
      kind: 'VoltageMeter',
      position: [620, 320],
      rotate: [[1, 0], [0, 1]],
      text: 'Right',
    },
    {
      kind: 'Line',
      path: [[180, 240], [220, 240]],
    },
    {
      kind: 'Line',
      path: [[340, 240], [320, 240]],
    },
    {
      kind: 'Line',
      path: [[460, 240], [420, 240]],
    },
    {
      kind: 'Line',
      path: [[320, 280], [320, 240]],
    },
    {
      kind: 'Line',
      path: [[320, 240], [300, 240]],
    },
    {
      kind: 'Line',
      path: [[320, 400], [320, 380]],
    },
    {
      kind: 'Line',
      path: [[340, 200], [320, 200]],
    },
    {
      kind: 'Line',
      path: [[460, 200], [440, 200]],
    },
    {
      kind: 'Line',
      path: [[460, 140], [440, 140], [440, 200]],
    },
    {
      kind: 'Line',
      path: [[440, 200], [420, 200]],
    },
    {
      kind: 'Line',
      path: [[540, 140], [560, 140], [560, 220]],
    },
    {
      kind: 'Line',
      path: [[560, 280], [560, 220]],
    },
    {
      kind: 'Line',
      path: [[560, 220], [540, 220]],
    },
    {
      kind: 'Line',
      path: [[560, 360], [560, 380]],
    },
    {
      kind: 'Line',
      path: [[320, 380], [320, 360]],
    },
    {
      kind: 'Line',
      path: [[620, 280], [620, 220], [560, 220]],
    },
    {
      kind: 'Line',
      path: [[620, 360], [620, 380], [560, 380]],
    },
    {
      kind: 'Line',
      path: [[560, 380], [320, 380]],
    },
  ],
};
