import type { CircuitStorage } from 'src/store';

export const data: CircuitStorage = {
  time: {
    end: '20m',
    step: '2u',
  },
  electronics: [
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
      params: ['10k'],
    },
    {
      kind: 'Resistance',
      position: [300, 380],
      rotate: [[0, 1], [-1, 0]],
      params: ['10k'],
    },
    {
      kind: 'Resistance',
      position: [400, 400],
      rotate: [[0, 1], [-1, 0]],
      params: ['680'],
    },
    {
      kind: 'TransistorNPN',
      position: [380, 280],
      rotate: [[1, 0], [0, 1]],
      params: ['40', '26', '0.6', '1'],
    },
    {
      kind: 'Resistance',
      position: [600, 400],
      rotate: [[0, 1], [-1, 0]],
      params: ['100k'],
    },
    {
      kind: 'Capacitor',
      position: [500, 340],
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
      params: ['3', '1k', '0', '0'],
    },
    {
      kind: 'VoltageMeter',
      position: [180, 360],
      rotate: [[1, 0], [0, 1]],
      text: 'Right',
    },
    {
      kind: 'VoltageMeter',
      position: [660, 400],
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
      path: [[400, 320], [400, 340]],
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
      path: [[600, 440], [600, 460]],
    },
    {
      kind: 'Line',
      path: [[400, 460], [300, 460]],
    },
    {
      kind: 'Line',
      path: [[660, 440], [660, 460], [600, 460]],
    },
    {
      kind: 'Line',
      path: [[600, 460], [400, 460]],
    },
    {
      kind: 'Line',
      path: [[400, 240], [400, 100], [300, 100]],
    },
    {
      kind: 'Line',
      path: [[300, 100], [300, 140]],
    },
    {
      kind: 'Line',
      path: [[540, 340], [600, 340]],
    },
    {
      kind: 'Line',
      path: [[660, 360], [660, 340], [600, 340]],
    },
    {
      kind: 'Line',
      path: [[600, 340], [600, 360]],
    },
    {
      kind: 'Line',
      path: [[460, 340], [400, 340]],
    },
    {
      kind: 'Line',
      path: [[400, 340], [400, 360]],
    },
  ],
};
