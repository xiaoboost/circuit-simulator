import type { CircuitData } from 'src/store';

export const data: CircuitData = {
  simulation: {
    end: '20m',
    step: '2u',
  },
  electronics: [
    {
      kind: 'DcVoltageSource',
      id: 'V_1',
      position: [620, 100],
      rotate: [[0, 1], [-1, 0]],
      params: ['20'],
    },
    {
      kind: 'ReferenceGround',
      id: 'GND_1',
      position: [540, 100],
      rotate: [[0, 1], [-1, 0]],
    },
    {
      kind: 'Resistance',
      id: 'R_1',
      position: [700, 180],
      rotate: [[0, 1], [-1, 0]],
      params: ['10k'],
    },
    {
      kind: 'Resistance',
      id: 'R_2',
      position: [700, 380],
      rotate: [[0, 1], [-1, 0]],
      params: ['10k'],
    },
    {
      kind: 'Resistance',
      id: 'R_3',
      position: [800, 400],
      rotate: [[0, 1], [-1, 0]],
      params: ['680'],
    },
    {
      kind: 'TransistorNPN',
      id: 'Q_1',
      position: [780, 280],
      rotate: [[1, 0], [0, 1]],
      params: ['40', '26', '0.6', '1'],
    },
    {
      kind: 'Resistance',
      id: 'R_4',
      position: [1000, 400],
      rotate: [[0, 1], [-1, 0]],
      params: ['100k'],
    },
    {
      kind: 'Capacitor',
      id: 'C_1',
      position: [900, 340],
      rotate: [[1, 0], [0, 1]],
      params: ['10n'],
    },
    {
      kind: 'Capacitor',
      id: 'C_2',
      position: [640, 280],
      rotate: [[1, 0], [0, 1]],
      params: ['10μ'],
    },
    {
      kind: 'AcVoltageSource',
      id: 'V_2',
      position: [520, 360],
      rotate: [[1, 0], [0, 1]],
      params: ['3', '1k', '0', '0'],
    },
    {
      kind: 'VoltageMeter',
      id: 'V_in',
      position: [580, 360],
      rotate: [[1, 0], [0, 1]],
      text: 'Right',
    },
    {
      kind: 'VoltageMeter',
      id: 'V_out',
      position: [1060, 400],
      rotate: [[1, 0], [0, 1]],
      text: 'Right',
    },
    {
      kind: 'ReferenceGround',
      id: 'GND_2',
      position: [520, 500],
      rotate: [[1, 0], [0, 1]],
    },
    {
      kind: 'Line',
      path: [[560, 100], [580, 100]],
    },
    {
      kind: 'Line',
      path: [[660, 100], [700, 100]],
    },
    {
      kind: 'Line',
      path: [[800, 320], [800, 340]],
    },
    {
      kind: 'Line',
      path: [[700, 220], [700, 280]],
    },
    {
      kind: 'Line',
      path: [[700, 340], [700, 280]],
    },
    {
      kind: 'Line',
      path: [[700, 280], [760, 280]],
    },
    {
      kind: 'Line',
      path: [[680, 280], [700, 280]],
    },
    {
      kind: 'Line',
      path: [[580, 320], [580, 280]],
    },
    {
      kind: 'Line',
      path: [[520, 320], [520, 280], [580, 280]],
    },
    {
      kind: 'Line',
      path: [[580, 280], [600, 280]],
    },
    {
      kind: 'Line',
      path: [[520, 480], [520, 460]],
    },
    {
      kind: 'Line',
      path: [[580, 400], [580, 460]],
    },
    {
      kind: 'Line',
      path: [[520, 400], [520, 460]],
    },
    {
      kind: 'Line',
      path: [[700, 420], [700, 460]],
    },
    {
      kind: 'Line',
      path: [[580, 460], [520, 460]],
    },
    {
      kind: 'Line',
      path: [[800, 440], [800, 460]],
    },
    {
      kind: 'Line',
      path: [[700, 460], [580, 460]],
    },
    {
      kind: 'Line',
      path: [[1000, 440], [1000, 460]],
    },
    {
      kind: 'Line',
      path: [[800, 460], [700, 460]],
    },
    {
      kind: 'Line',
      path: [[1060, 440], [1060, 460], [1000, 460]],
    },
    {
      kind: 'Line',
      path: [[1000, 460], [800, 460]],
    },
    {
      kind: 'Line',
      path: [[800, 240], [800, 100], [700, 100]],
    },
    {
      kind: 'Line',
      path: [[700, 100], [700, 140]],
    },
    {
      kind: 'Line',
      path: [[940, 340], [1000, 340]],
    },
    {
      kind: 'Line',
      path: [[1060, 360], [1060, 340], [1000, 340]],
    },
    {
      kind: 'Line',
      path: [[1000, 340], [1000, 360]],
    },
    {
      kind: 'Line',
      path: [[860, 340], [800, 340]],
    },
    {
      kind: 'Line',
      path: [[800, 340], [800, 360]],
    },
  ],
};
