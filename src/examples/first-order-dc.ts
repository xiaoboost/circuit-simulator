import type { CircuitStorage } from 'src/store';

export const data: CircuitStorage = {
  time: {
    end: '10m',
    step: '10u',
  },
  oscilloscopes: [
    ['V_in', 'V_C1'],
  ],
  data: [
    {
      kind: 'DcVoltageSource',
      position: [180, 280],
      rotate: [[1, 0], [0, 1]],
      params: ['10'],
    },
    {
      kind: 'Resistance',
      position: [340, 200],
      rotate: [[1, 0], [0, 1]],
      params: ['1k'],
    },
    {
      kind: 'Capacitor',
      position: [420, 280],
      rotate: [[0, 1], [-1, 0]],
      params: ['1u'],
    },
    {
      kind: 'ReferenceGround',
      position: [340, 400],
      rotate: [[1, 0], [0, 1]],
    },
    {
      kind: 'Line',
      path: [[380, 200], [420, 200]],
    },
    {
      kind: 'Line',
      path: [[180, 240], [180, 200], [260, 200]],
    },
    {
      kind: 'Line',
      path: [[180, 320], [180, 360], [260, 360]],
    },
    {
      kind: 'Line',
      path: [[340, 380], [340, 360]],
    },
    {
      kind: 'Line',
      path: [[340, 360], [420, 360]],
    },
    {
      kind: 'Line',
      path: [[520, 240], [520, 200], [420, 200]],
    },
    {
      kind: 'Line',
      path: [[420, 240], [420, 200]],
    },
    {
      kind: 'Line',
      path: [[520, 320], [520, 360], [420, 360]],
    },
    {
      kind: 'Line',
      path: [[420, 320], [420, 360]],
    },
    {
      kind: 'Line',
      path: [[260, 240], [260, 200]],
    },
    {
      kind: 'Line',
      path: [[260, 200], [300, 200]],
    },
    {
      kind: 'Line',
      path: [[260, 320], [260, 360]],
    },
    {
      kind: 'Line',
      path: [[260, 360], [340, 360]],
    },
    {
      kind: 'VoltageMeter',
      position: [260, 280],
      rotate: [[1, 0], [0, 1]],
    },
    {
      kind: 'VoltageMeter',
      position: [520, 280],
      rotate: [[1, 0], [0, 1]],
    },
  ],
};
