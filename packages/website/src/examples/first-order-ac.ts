import type { CircuitStorage } from 'src/store';

export const data: CircuitStorage = {
  time: {
    end: '20m',
    step: '10u',
  },
  oscilloscopes: [
    ['V_in', 'V_C1'],
  ],
  electronics: [
    {
      kind: 'Resistance',
      position: [740, 200],
      rotate: [[1, 0], [0, 1]],
      params: ['200'],
    },
    {
      kind: 'Capacitor',
      position: [820, 280],
      rotate: [[0, 1], [-1, 0]],
      params: ['10u'],
    },
    {
      kind: 'ReferenceGround',
      position: [740, 400],
      rotate: [[1, 0], [0, 1]],
    },
    {
      kind: 'VoltageMeter',
      position: [660, 280],
      rotate: [[1, 0], [0, 1]],
    },
    {
      kind: 'VoltageMeter',
      position: [920, 280],
      rotate: [[1, 0], [0, 1]],
    },
    {
      kind: 'AcVoltageSource',
      position: [560, 280],
      rotate: [[1, 0], [0, 1]],
      params: ['20', '100', '0', '0'],
    },
    {
      kind: 'Line',
      path: [[780, 200], [820, 200]],
    },
    {
      kind: 'Line',
      path: [[740, 380], [740, 360]],
    },
    {
      kind: 'Line',
      path: [[740, 360], [820, 360]],
    },
    {
      kind: 'Line',
      path: [[920, 240], [920, 200], [820, 200]],
    },
    {
      kind: 'Line',
      path: [[820, 240], [820, 200]],
    },
    {
      kind: 'Line',
      path: [[920, 320], [920, 360], [820, 360]],
    },
    {
      kind: 'Line',
      path: [[820, 320], [820, 360]],
    },
    {
      kind: 'Line',
      path: [[660, 240], [660, 200]],
    },
    {
      kind: 'Line',
      path: [[660, 320], [660, 360]],
    },
    {
      kind: 'Line',
      path: [[560, 240], [560, 200], [660, 200]],
    },
    {
      kind: 'Line',
      path: [[660, 200], [700, 200]],
    },
    {
      kind: 'Line',
      path: [[560, 320], [560, 360], [660, 360]],
    },
    {
      kind: 'Line',
      path: [[660, 360], [740, 360]],
    },
  ],
};
