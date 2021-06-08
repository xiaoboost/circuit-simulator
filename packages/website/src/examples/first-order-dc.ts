import type { CircuitData } from 'src/store';

export const data: CircuitData = {
  simulation: {
    end: '10m',
    step: '10u',
  },
  oscilloscopes: [
    ['V_in', 'V_C1'],
  ],
  electronics: [
    {
      kind: 'DcVoltageSource',
      id: 'V_1',
      position: [580, 280],
      rotate: [[1, 0], [0, 1]],
      params: ['10'],
    },
    {
      kind: 'Resistance',
      id: 'R_1',
      position: [740, 200],
      rotate: [[1, 0], [0, 1]],
      params: ['1k'],
    },
    {
      kind: 'Capacitor',
      id: 'C_1',
      position: [820, 280],
      rotate: [[0, 1], [-1, 0]],
      params: ['1u'],
    },
    {
      kind: 'ReferenceGround',
      id: 'GND_1',
      position: [740, 400],
      rotate: [[1, 0], [0, 1]],
    },
    {
      kind: 'VoltageMeter',
      id: 'V_in',
      position: [660, 280],
      rotate: [[1, 0], [0, 1]],
    },
    {
      kind: 'VoltageMeter',
      id: 'V_C1',
      position: [920, 280],
      rotate: [[1, 0], [0, 1]],
    },
    {
      kind: 'Line',
      path: [[780, 200], [820, 200]],
    },
    {
      kind: 'Line',
      path: [[580, 240], [580, 200], [660, 200]],
    },
    {
      kind: 'Line',
      path: [[580, 320], [580, 360], [660, 360]],
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
      path: [[660, 200], [700, 200]],
    },
    {
      kind: 'Line',
      path: [[660, 320], [660, 360]],
    },
    {
      kind: 'Line',
      path: [[660, 360], [740, 360]],
    },
  ],
};
