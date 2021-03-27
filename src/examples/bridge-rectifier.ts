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
  data: [
    {
      kind: 'Diode',
      position: [300, 200],
      rotate: [[1, 0], [0, 1]],
      params: ['1', '0.5', '0.2G'],
    },
    {
      kind: 'Diode',
      position: [380, 200],
      rotate: [[1, 0], [0, 1]],
      params: ['1', '0.5', '0.2G'],
    },
    {
      kind: 'Diode',
      position: [300, 440],
      rotate: [[1, 0], [0, 1]],
      params: ['1', '0.5', '0.2G'],
    },
    {
      kind: 'Diode',
      position: [380, 440],
      rotate: [[1, 0], [0, 1]],
      params: ['1', '0.5', '0.2G'],
    },
    {
      kind: 'AcVoltageSource',
      position: [180, 320],
      rotate: [[1, 0], [0, 1]],
      params: ['220', '200', '0', '0'],
    },
    {
      kind: 'Capacitor',
      position: [500, 320],
      rotate: [[0, 1], [-1, 0]],
      params: ['100u'],
    },
    {
      kind: 'Resistance',
      position: [560, 320],
      rotate: [[0, 1], [-1, 0]],
      params: ['2k'],
      text: 'Right',
    },
    {
      kind: 'CurrentMeter',
      position: [440, 140],
      rotate: [[1, 0], [0, 1]],
    },
    {
      kind: 'VoltageMeter',
      position: [640, 320],
      rotate: [[1, 0], [0, 1]],
      text: 'Right',
    },
    {
      kind: 'VoltageMeter',
      position: [240, 320],
      rotate: [[1, 0], [0, 1]],
      text: 'Right',
    },
    {
      kind: 'ReferenceGround',
      position: [300, 540],
      rotate: [[1, 0], [0, 1]],
    },
    {
      kind: 'Line',
      path: [[180, 280], [180, 260], [240, 260]],
    },
    {
      kind: 'Line',
      path: [[180, 360], [180, 380], [240, 380]],
    },
    {
      kind: 'Line',
      path: [[300, 160], [300, 140], [380, 140]],
    },
    {
      kind: 'Line',
      path: [[640, 280], [640, 140], [560, 140]],
    },
    {
      kind: 'Line',
      path: [[640, 360], [640, 500], [560, 500]],
    },
    {
      kind: 'Line',
      path: [[380, 240], [380, 380]],
    },
    {
      kind: 'Line',
      path: [[380, 380], [380, 400]],
    },
    {
      kind: 'Line',
      path: [[300, 400], [300, 260]],
    },
    {
      kind: 'Line',
      path: [[300, 260], [300, 240]],
    },
    {
      kind: 'Line',
      path: [[560, 280], [560, 140]],
    },
    {
      kind: 'Line',
      path: [[380, 480], [380, 500]],
    },
    {
      kind: 'Line',
      path: [[300, 480], [300, 500]],
    },
    {
      kind: 'Line',
      path: [[380, 500], [500, 500]],
    },
    {
      kind: 'Line',
      path: [[560, 360], [560, 500]],
    },
    {
      kind: 'Line',
      path: [[500, 360], [500, 500]],
    },
    {
      kind: 'Line',
      path: [[460, 140], [500, 140]],
    },
    {
      kind: 'Line',
      path: [[500, 280], [500, 140]],
    },
    {
      kind: 'Line',
      path: [[420, 140], [380, 140]],
    },
    {
      kind: 'Line',
      path: [[380, 140], [380, 160]],
    },
    {
      kind: 'Line',
      path: [[560, 140], [500, 140]],
    },
    {
      kind: 'Line',
      path: [[560, 500], [500, 500]],
    },
    {
      kind: 'Line',
      path: [[240, 280], [240, 260]],
    },
    {
      kind: 'Line',
      path: [[240, 260], [300, 260]],
    },
    {
      kind: 'Line',
      path: [[240, 360], [240, 380]],
    },
    {
      kind: 'Line',
      path: [[240, 380], [380, 380]],
    },
    {
      kind: 'Line',
      path: [[300, 520], [300, 500]],
    },
    {
      kind: 'Line',
      path: [[300, 500], [380, 500]],
    },
  ],
};
