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
      kind: 'Diode',
      position: [700, 200],
      rotate: [[1, 0], [0, 1]],
      params: ['1', '0.5', '0.2G'],
    },
    {
      kind: 'Diode',
      position: [780, 200],
      rotate: [[1, 0], [0, 1]],
      params: ['1', '0.5', '0.2G'],
    },
    {
      kind: 'Diode',
      position: [700, 440],
      rotate: [[1, 0], [0, 1]],
      params: ['1', '0.5', '0.2G'],
    },
    {
      kind: 'Diode',
      position: [780, 440],
      rotate: [[1, 0], [0, 1]],
      params: ['1', '0.5', '0.2G'],
    },
    {
      kind: 'AcVoltageSource',
      position: [580, 320],
      rotate: [[1, 0], [0, 1]],
      params: ['220', '200', '0', '0'],
      text: 'Left',
    },
    {
      kind: 'Capacitor',
      position: [900, 320],
      rotate: [[0, 1], [-1, 0]],
      params: ['100u'],
      text: 'Left',
    },
    {
      kind: 'Resistance',
      position: [960, 320],
      rotate: [[0, 1], [-1, 0]],
      params: ['2k'],
      text: 'Right',
    },
    {
      kind: 'CurrentMeter',
      position: [840, 140],
      rotate: [[1, 0], [0, 1]],
    },
    {
      kind: 'VoltageMeter',
      position: [1040, 320],
      rotate: [[1, 0], [0, 1]],
      text: 'Right',
    },
    {
      kind: 'VoltageMeter',
      position: [640, 320],
      rotate: [[1, 0], [0, 1]],
      text: 'Right',
    },
    {
      kind: 'ReferenceGround',
      position: [700, 540],
      rotate: [[1, 0], [0, 1]],
    },
    {
      kind: 'Line',
      path: [[580, 280], [580, 260], [640, 260]],
    },
    {
      kind: 'Line',
      path: [[580, 360], [580, 380], [640, 380]],
    },
    {
      kind: 'Line',
      path: [[700, 160], [700, 140], [780, 140]],
    },
    {
      kind: 'Line',
      path: [[1040, 280], [1040, 140], [960, 140]],
    },
    {
      kind: 'Line',
      path: [[1040, 360], [1040, 500], [960, 500]],
    },
    {
      kind: 'Line',
      path: [[780, 240], [780, 380]],
    },
    {
      kind: 'Line',
      path: [[780, 380], [780, 400]],
    },
    {
      kind: 'Line',
      path: [[700, 400], [700, 260]],
    },
    {
      kind: 'Line',
      path: [[700, 260], [700, 240]],
    },
    {
      kind: 'Line',
      path: [[960, 280], [960, 140]],
    },
    {
      kind: 'Line',
      path: [[780, 480], [780, 500]],
    },
    {
      kind: 'Line',
      path: [[700, 480], [700, 500]],
    },
    {
      kind: 'Line',
      path: [[780, 500], [900, 500]],
    },
    {
      kind: 'Line',
      path: [[960, 360], [960, 500]],
    },
    {
      kind: 'Line',
      path: [[900, 360], [900, 500]],
    },
    {
      kind: 'Line',
      path: [[860, 140], [900, 140]],
    },
    {
      kind: 'Line',
      path: [[900, 280], [900, 140]],
    },
    {
      kind: 'Line',
      path: [[820, 140], [780, 140]],
    },
    {
      kind: 'Line',
      path: [[780, 140], [780, 160]],
    },
    {
      kind: 'Line',
      path: [[960, 140], [900, 140]],
    },
    {
      kind: 'Line',
      path: [[960, 500], [900, 500]],
    },
    {
      kind: 'Line',
      path: [[640, 280], [640, 260]],
    },
    {
      kind: 'Line',
      path: [[640, 260], [700, 260]],
    },
    {
      kind: 'Line',
      path: [[640, 360], [640, 380]],
    },
    {
      kind: 'Line',
      path: [[640, 380], [780, 380]],
    },
    {
      kind: 'Line',
      path: [[700, 520], [700, 500]],
    },
    {
      kind: 'Line',
      path: [[700, 500], [780, 500]],
    },
  ],
};
