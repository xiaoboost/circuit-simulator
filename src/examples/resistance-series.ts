import type { CircuitStorage } from 'src/store';

export const data: CircuitStorage = {
  time: {
    end: '10m',
    step: '10u',
  },
  oscilloscopes: [
    ['I_in'],
    ['V_R1'],
  ],
  electronics: [
    {
      kind: 'Resistance',
      position: [700, 160],
      rotate: [[0, 1], [-1, 0]],
      text: 'Right',
      params: ['1k'],
    },
    {
      kind: 'Resistance',
      position: [700, 320],
      rotate: [[0, 1], [-1, 0]],
      text: 'Right',
      params: ['1k'],
    },
    {
      kind: 'ReferenceGround',
      position: [500, 420],
    },
    {
      kind: 'VoltageMeter',
      position: [780, 160],
      text: 'Right',
    },
    {
      kind: 'DcCurrentSource',
      position: [500, 180],
      text: 'Right',
      params: ['10m'],
    },
    {
      kind: 'DcVoltageSource',
      position: [500, 300],
      text: 'Right',
      params: ['12'],
    },
    {
      kind: 'CurrentMeter',
      position: [600, 100],
      text: 'Top',
    },
    {
      kind: 'Line',
      path: [[700, 120], [700, 100]],
    },
    {
      kind: 'Line',
      path: [[780, 200], [780, 220], [700, 220]],
    },
    {
      kind: 'Line',
      path: [[700, 200], [700, 220]],
    },
    {
      kind: 'Line',
      path: [[700, 220], [700, 280]],
    },
    {
      kind: 'Line',
      path: [[500, 400], [500, 380]],
    },
    {
      kind: 'Line',
      path: [[500, 140], [500, 100], [580, 100]],
    },
    {
      kind: 'Line',
      path: [[620, 100], [700, 100]],
    },
    {
      kind: 'Line',
      path: [[700, 100], [780, 100], [780, 120]],
    },
    {
      kind: 'Line',
      path: [[500, 340], [500, 380]],
    },
    {
      kind: 'Line',
      path: [[500, 380], [700, 380], [700, 360]],
    },
    {
      kind: 'Line',
      path: [[500, 260], [500, 220]],
    },
  ],
};
