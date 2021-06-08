import type { CircuitData } from 'src/store';

export const data: CircuitData = {
  simulation: {
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
      id: 'V_1',
      position: [540, 220],
      rotate: [[1, 0], [0, 1]],
      params: ['25', '50', '0', '0'],
    },
    {
      kind: 'Diode',
      id: 'VD_1',
      position: [680, 140],
      rotate: [[0, 1], [-1, 0]],
      params: ['1', '0.5', '0.2G'],
    },
    {
      kind: 'Resistance',
      id: 'R_1',
      position: [860, 220],
      rotate: [[0, 1], [-1, 0]],
      params: ['100'],
    },
    {
      kind: 'ReferenceGround',
      id: 'GND_1',
      position: [720, 340],
      rotate: [[1, 0], [0, 1]],
    },
    {
      kind: 'CurrentMeter',
      id: 'I_out',
      position: [800, 140],
      rotate: [[1, 0], [0, 1]],
    },
    {
      kind: 'VoltageMeter',
      id: 'V_in',
      position: [600, 220],
      rotate: [[1, 0], [0, 1]],
      text: 'Right',
    },
    {
      kind: 'VoltageMeter',
      id: 'V_out',
      position: [920, 220],
      rotate: [[1, 0], [0, 1]],
      text: 'Right',
    },
    {
      kind: 'Line',
      path: [[540, 180], [540, 140], [600, 140]],
    },
    {
      kind: 'Line',
      path: [[600, 180], [600, 140]],
    },
    {
      kind: 'Line',
      path: [[600, 140], [640, 140]],
    },
    {
      kind: 'Line',
      path: [[720, 140], [780, 140]],
    },
    {
      kind: 'Line',
      path: [[820, 140], [860, 140]],
    },
    {
      kind: 'Line',
      path: [[920, 180], [920, 140], [860, 140]],
    },
    {
      kind: 'Line',
      path: [[860, 140], [860, 180]],
    },
    {
      kind: 'Line',
      path: [[540, 260], [540, 300], [600, 300]],
    },
    {
      kind: 'Line',
      path: [[600, 260], [600, 300]],
    },
    {
      kind: 'Line',
      path: [[600, 300], [720, 300]],
    },
    {
      kind: 'Line',
      path: [[720, 320], [720, 300]],
    },
    {
      kind: 'Line',
      path: [[720, 300], [860, 300]],
    },
    {
      kind: 'Line',
      path: [[920, 260], [920, 300], [860, 300]],
    },
    {
      kind: 'Line',
      path: [[860, 300], [860, 260]],
    },
  ],
};
