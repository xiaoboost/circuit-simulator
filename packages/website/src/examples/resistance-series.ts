import type { CircuitData } from 'src/store';

export const data: CircuitData = {
  simulation: {
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
      position: [1100, 160],
      rotate: [[0, 1], [-1, 0]],
      text: 'Right',
      params: ['1k'],
    },
    {
      kind: 'Resistance',
      position: [1100, 320],
      rotate: [[0, 1], [-1, 0]],
      text: 'Right',
      params: ['1k'],
    },
    {
      kind: 'ReferenceGround',
      position: [900, 420],
    },
    {
      kind: 'VoltageMeter',
      position: [1180, 160],
      text: 'Right',
    },
    {
      kind: 'DcCurrentSource',
      position: [900, 180],
      text: 'Right',
      params: ['10m'],
    },
    {
      kind: 'DcVoltageSource',
      position: [900, 300],
      text: 'Right',
      params: ['12'],
    },
    {
      kind: 'CurrentMeter',
      position: [1000, 100],
      text: 'Top',
    },
    {
      kind: 'Line',
      path: [[1100, 120], [1100, 100]],
    },
    {
      kind: 'Line',
      path: [[1180, 200], [1180, 220], [1100, 220]],
    },
    {
      kind: 'Line',
      path: [[1100, 200], [1100, 220]],
    },
    {
      kind: 'Line',
      path: [[1100, 220], [1100, 280]],
    },
    {
      kind: 'Line',
      path: [[900, 400], [900, 380]],
    },
    {
      kind: 'Line',
      path: [[900, 140], [900, 100], [980, 100]],
    },
    {
      kind: 'Line',
      path: [[1020, 100], [1100, 100]],
    },
    {
      kind: 'Line',
      path: [[1100, 100], [1180, 100], [1180, 120]],
    },
    {
      kind: 'Line',
      path: [[900, 340], [900, 380]],
    },
    {
      kind: 'Line',
      path: [[900, 380], [1100, 380], [1100, 360]],
    },
    {
      kind: 'Line',
      path: [[900, 260], [900, 220]],
    },
  ],
};
