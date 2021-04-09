import type { CircuitStorage } from 'src/store';

export const data: CircuitStorage = {
  time: {
    end: '20m',
    step: '5u',
  },
  oscilloscopes: [
    ['V_in', 'V_out'],
    ['I_out'],
  ],
  electronics: [
    {
      kind: 'AcVoltageSource',
      position: [140, 220],
      rotate: [[1, 0], [0, 1]],
      params: ['25', '50', '0', '0'],
    },
    {
      kind: 'Diode',
      position: [280, 140],
      rotate: [[0, 1], [-1, 0]],
      params: ['1', '0.5', '0.2G'],
    },
    {
      kind: 'Resistance',
      position: [460, 220],
      rotate: [[0, 1], [-1, 0]],
      params: ['100'],
    },
    {
      kind: 'ReferenceGround',
      position: [320, 340],
      rotate: [[1, 0], [0, 1]],
    },
    {
      kind: 'CurrentMeter',
      position: [400, 140],
      rotate: [[1, 0], [0, 1]],
    },
    {
      kind: 'VoltageMeter',
      position: [200, 220],
      rotate: [[1, 0], [0, 1]],
      text: 'Right',
    },
    {
      kind: 'VoltageMeter',
      position: [520, 220],
      rotate: [[1, 0], [0, 1]],
      text: 'Right',
    },
    {
      kind: 'Line',
      path: [[140, 180], [140, 140], [200, 140]],
    },
    {
      kind: 'Line',
      path: [[200, 180], [200, 140]],
    },
    {
      kind: 'Line',
      path: [[200, 140], [240, 140]],
    },
    {
      kind: 'Line',
      path: [[320, 140], [380, 140]],
    },
    {
      kind: 'Line',
      path: [[420, 140], [460, 140]],
    },
    {
      kind: 'Line',
      path: [[520, 180], [520, 140], [460, 140]],
    },
    {
      kind: 'Line',
      path: [[460, 140], [460, 180]],
    },
    {
      kind: 'Line',
      path: [[140, 260], [140, 300], [200, 300]],
    },
    {
      kind: 'Line',
      path: [[200, 260], [200, 300]],
    },
    {
      kind: 'Line',
      path: [[200, 300], [320, 300]],
    },
    {
      kind: 'Line',
      path: [[320, 320], [320, 300]],
    },
    {
      kind: 'Line',
      path: [[320, 300], [460, 300]],
    },
    {
      kind: 'Line',
      path: [[520, 260], [520, 300], [460, 300]],
    },
    {
      kind: 'Line',
      path: [[460, 300], [460, 260]],
    },
  ],
};
