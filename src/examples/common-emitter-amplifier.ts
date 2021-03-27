import type { CircuitStorage } from 'src/store';

export const data: CircuitStorage = {
  time: {
    end: '50m',
    step: '10u',
  },
  data: [
    {
      kind: 'DcVoltageSource',
      position: [220, 100],
      rotate: [[0, 1], [-1, 0]],
      params: ['20'],
    },
    {
      kind: 'ReferenceGround',
      position: [140, 100],
      rotate: [[0, 1], [-1, 0]],
    },
    {
      kind: 'Resistance',
      position: [300, 180],
      rotate: [[0, 1], [-1, 0]],
      params: ['100k'],
    },
    {
      kind: 'Resistance',
      position: [300, 380],
      rotate: [[0, 1], [-1, 0]],
      params: ['100k'],
    },
    {
      kind: 'Resistance',
      position: [400, 160],
      rotate: [[0, 1], [-1, 0]],
      params: ['10k'],
    },
    {
      kind: 'Resistance',
      position: [400, 400],
      rotate: [[0, 1], [-1, 0]],
      params: ['2k'],
    },
    {
      kind: 'TransistorNPN',
      position: [380, 280],
      rotate: [[1, 0], [0, 1]],
      params: ['40', '26', '0.6', '1'],
    },
    {
      kind: 'Resistance',
      position: [600, 340],
      rotate: [[0, 1], [-1, 0]],
      params: ['1M'],
    },
    {
      kind: 'Capacitor',
      position: [500, 220],
      rotate: [[1, 0], [0, 1]],
      params: ['10n'],
    },
    {
      kind: 'Capacitor',
      position: [240, 280],
      rotate: [[1, 0], [0, 1]],
      params: ['10μ'],
    },
    {
      kind: 'AcVoltageSource',
      position: [120, 360],
      rotate: [[1, 0], [0, 1]],
      params: ['3', '300', '0', '0'],
    },
    {
      kind: 'VoltageMeter',
      position: [180, 360],
      rotate: [[1, 0], [0, 1]],
      text: 'Right',
    },
    {
      kind: 'VoltageMeter',
      position: [660, 340],
      rotate: [[1, 0], [0, 1]],
      text: 'Right',
    },
    {
      kind: 'ReferenceGround',
      position: [120, 500],
      rotate: [[1, 0], [0, 1]],
    },
    {
      kind: 'Line',
      path: [[160, 100], [180, 100]],
    },
    {
      kind: 'Line',
      path: [[260, 100], [300, 100]],
    },
    {
      kind: 'Line',
      path: [[400, 120], [400, 100], [300, 100]],
    },
    {
      kind: 'Line',
      path: [[300, 140], [300, 100]],
    },
    {
      kind: 'Line',
      path: [[400, 240], [400, 220]],
    },
    {
      kind: 'Line',
      path: [[400, 320], [400, 360]],
    },
    {
      kind: 'Line',
      path: [[300, 220], [300, 280]],
    },
    {
      kind: 'Line',
      path: [[300, 340], [300, 280]],
    },
    {
      kind: 'Line',
      path: [[300, 280], [360, 280]],
    },
    {
      kind: 'Line',
      path: [[540, 220], [600, 220]],
    },
    {
      kind: 'Line',
      path: [[660, 300], [660, 220], [600, 220]],
    },
    {
      kind: 'Line',
      path: [[600, 220], [600, 300]],
    },
    {
      kind: 'Line',
      path: [[460, 220], [400, 220]],
    },
    {
      kind: 'Line',
      path: [[400, 220], [400, 200]],
    },
    {
      kind: 'Line',
      path: [[280, 280], [300, 280]],
    },
    {
      kind: 'Line',
      path: [[180, 320], [180, 280]],
    },
    {
      kind: 'Line',
      path: [[120, 320], [120, 280], [180, 280]],
    },
    {
      kind: 'Line',
      path: [[180, 280], [200, 280]],
    },
    {
      kind: 'Line',
      path: [[120, 480], [120, 460]],
    },
    {
      kind: 'Line',
      path: [[180, 400], [180, 460]],
    },
    {
      kind: 'Line',
      path: [[120, 400], [120, 460]],
    },
    {
      kind: 'Line',
      path: [[300, 420], [300, 460]],
    },
    {
      kind: 'Line',
      path: [[180, 460], [120, 460]],
    },
    {
      kind: 'Line',
      path: [[400, 440], [400, 460]],
    },
    {
      kind: 'Line',
      path: [[300, 460], [180, 460]],
    },
    {
      kind: 'Line',
      path: [[600, 380], [600, 460]],
    },
    {
      kind: 'Line',
      path: [[400, 460], [300, 460]],
    },
    {
      kind: 'Line',
      path: [[660, 380], [660, 460], [600, 460]],
    },
    {
      kind: 'Line',
      path: [[600, 460], [400, 460]],
    },
  ],
};
