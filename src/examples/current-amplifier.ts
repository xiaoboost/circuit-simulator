import type { CircuitStorage } from 'src/store';

export const data: CircuitStorage = {
  data: [
    {
      kind: 'DcVoltageSource',
      position: [180, 280],
      rotate: [[0, 1], [-1, 0]],
      params: ['10'],
    },
    {
      kind: 'Resistance',
      position: [300, 280],
      rotate: [[1, 0], [0, 1]],
      params: ['10k'],
    },
    {
      kind: 'TransistorNPN',
      position: [480, 280],
      rotate: [[1, 0], [0, 1]],
      params: ['40', '26', '0.6', '1'],
    },
    {
      kind: 'ReferenceGround',
      position: [100, 280],
      rotate: [[0, 1], [-1, 0]],
    },
    {
      kind: 'Resistance',
      position: [500, 400],
      rotate: [[0, 1], [-1, 0]],
      params: ['100'],
    },
    {
      kind: 'CurrentMeter',
      position: [400, 280],
      rotate: [[1, 0], [0, 1]],
    },
    {
      kind: 'CurrentMeter',
      position: [340, 200],
      rotate: [[1, 0], [0, 1]],
    },
    {
      kind: 'ReferenceGround',
      position: [500, 480],
      rotate: [[1, 0], [0, 1]],
    },
    {
      kind: 'Line',
      path: [[120, 280], [140, 280]],
    },
    {
      kind: 'Line',
      path: [[220, 280], [240, 280]],
    },
    {
      kind: 'Line',
      path: [[500, 360], [500, 320]],
    },
    {
      kind: 'Line',
      path: [[420, 280], [460, 280]],
    },
    {
      kind: 'Line',
      path: [[380, 280], [340, 280]],
    },
    {
      kind: 'Line',
      path: [[360, 200], [500, 200], [500, 240]],
    },
    {
      kind: 'Line',
      path: [[320, 200], [240, 200], [240, 280]],
    },
    {
      kind: 'Line',
      path: [[240, 280], [260, 280]],
    },
    {
      kind: 'Line',
      path: [[500, 440], [500, 460]],
    },
  ],
};
