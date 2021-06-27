import type { PartData, LineData } from '@circuit/electronics';

type Data = (PartData | LineData)[];

export const noApartPart: Data = [
  {
    kind: 'Resistance',
    id: 'R_1',
    position: [740, 200],
    rotate: [[1, 0], [0, 1]],
    params: ['200'],
  },
  {
    kind: 'Capacitor',
    id: 'C_1',
    position: [820, 280],
    rotate: [[0, 1], [-1, 0]],
    params: ['10u'],
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
    kind: 'AcVoltageSource',
    id: 'V_1',
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
];

export const apartPart: Data = [
  {
    kind: 'AcVoltageSource',
    id: 'V_1',
    position: [540, 220],
    rotate: [[1, 0], [0, 1]],
    params: ['25', '50', '0', '0'],
    text: 'Left',
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
    text: 'Left',
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
];
