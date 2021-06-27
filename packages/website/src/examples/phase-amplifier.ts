import type { CircuitData } from 'src/store';

export const data: CircuitData = {
  simulation: {
    end: '20m',
    step: '2u',
  },
  oscilloscopes: [
    ['V_in', 'V_out'],
  ],
  electronics: [
    {
      kind: 'AcVoltageSource',
      id: 'V_1',
      position: [660, 240],
      rotate: [[0, 1], [-1, 0]],
      params: ['10', '200', '0', '0'],
    },
    {
      kind: 'OperationalAmplifier',
      id: 'OP_1',
      position: [900, 220],
      rotate: [[1, 0], [0, 1]],
      params: ['120', '80M', '40'],
    },
    {
      kind: 'Resistance',
      id: 'R_1',
      position: [780, 240],
      rotate: [[1, 0], [0, 1]],
      params: ['10k'],
      text: 'Bottom',
    },
    {
      kind: 'ReferenceGround',
      id: 'GND_1',
      position: [560, 240],
      rotate: [[0, 1], [-1, 0]],
    },
    {
      kind: 'VoltageMeter',
      id: 'V_in',
      position: [720, 320],
      rotate: [[1, 0], [0, 1]],
    },
    {
      kind: 'ReferenceGround',
      id: 'GND_2',
      position: [720, 420],
      rotate: [[1, 0], [0, 1]],
    },
    {
      kind: 'Resistance',
      id: 'R_2',
      position: [900, 140],
      rotate: [[1, 0], [0, 1]],
      params: ['10k'],
      text: 'Top',
    },
    {
      kind: 'Resistance',
      id: 'R_3',
      position: [780, 200],
      rotate: [[1, 0], [0, 1]],
      params: ['10k'],
      text: 'Top',
    },
    {
      kind: 'ReferenceGround',
      id: 'GND_3',
      position: [700, 200],
      rotate: [[0, 1], [-1, 0]],
    },
    {
      kind: 'Resistance',
      id: 'R_4',
      position: [960, 320],
      rotate: [[0, 1], [-1, 0]],
      params: ['10k'],
      text: 'Left',
    },
    {
      kind: 'VoltageMeter',
      id: 'V_out',
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
