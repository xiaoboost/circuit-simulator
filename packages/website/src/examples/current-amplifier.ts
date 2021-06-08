import type { CircuitData } from 'src/store';

export const data: CircuitData = {
  electronics: [
    {
      kind: 'DcVoltageSource',
      id: 'V_1',
      position: [580, 280],
      rotate: [[0, 1], [-1, 0]],
      params: ['10'],
    },
    {
      kind: 'Resistance',
      id: 'R_1',
      position: [700, 280],
      rotate: [[1, 0], [0, 1]],
      params: ['10k'],
    },
    {
      kind: 'TransistorNPN',
      id: 'Q_1',
      position: [880, 280],
      rotate: [[1, 0], [0, 1]],
      params: ['40', '26', '0.6', '1'],
    },
    {
      kind: 'ReferenceGround',
      id: 'GND_1',
      position: [500, 280],
      rotate: [[0, 1], [-1, 0]],
    },
    {
      kind: 'Resistance',
      id: 'R_2',
      position: [900, 400],
      rotate: [[0, 1], [-1, 0]],
      params: ['100'],
    },
    {
      kind: 'CurrentMeter',
      id: 'I_in',
      position: [800, 280],
      rotate: [[1, 0], [0, 1]],
    },
    {
      kind: 'CurrentMeter',
      id: 'I_ap',
      position: [740, 200],
      rotate: [[1, 0], [0, 1]],
    },
    {
      kind: 'ReferenceGround',
      id: 'GND_2',
      position: [900, 480],
      rotate: [[1, 0], [0, 1]],
    },
    {
      kind: 'Line',
      path: [[520, 280], [540, 280]],
    },
    {
      kind: 'Line',
      path: [[620, 280], [640, 280]],
    },
    {
      kind: 'Line',
      path: [[900, 360], [900, 320]],
    },
    {
      kind: 'Line',
      path: [[820, 280], [860, 280]],
    },
    {
      kind: 'Line',
      path: [[780, 280], [740, 280]],
    },
    {
      kind: 'Line',
      path: [[760, 200], [900, 200], [900, 240]],
    },
    {
      kind: 'Line',
      path: [[720, 200], [640, 200], [640, 280]],
    },
    {
      kind: 'Line',
      path: [[640, 280], [660, 280]],
    },
    {
      kind: 'Line',
      path: [[900, 440], [900, 460]],
    },
  ],
};
