import test from 'ava';

import { snapshot, createContext, loadData, loadSpace } from './utils';

test('导线图纸标记，两端器件', ({ deepEqual }) => {
  const context = createContext();

  loadData([
    {
      id: 'R_1',
      kind: 'Resistance',
      position: [100, 100],
    },
    {
      id: 'R_2',
      kind: 'Resistance',
      position: [240, 200],
    },
    {
      kind: 'Line',
      path: [[140, 100], [200, 100], [200, 200]],
    },
  ], context);

  snapshot('line-two-part', context.map.toData(), deepEqual);
});

test('连接悬空导线', ({ deepEqual }) => {
  const context = createContext();

  loadData([
    {
      id: 'R_1',
      kind: 'Resistance',
      position: [100, 100],
    },
    {
      id: 'R_2',
      kind: 'Resistance',
      position: [300, 140],
    },
    {
      kind: 'Line',
      path: [[140, 100], [200, 100], [200, 120]],
    }
  ], context);

  snapshot('concat-space-line-before', context.map.toData(), deepEqual);

  const { lines } = loadData([{
    kind: 'Line',
    path: [[260, 140], [200, 140], [200, 120]],
  }], context);

  lines[0].setConnectionByPath();
  deepEqual(lines[0].connections.map((item) => item.toData()), [
    [{
      id: 'R_2',
      mark: 0,
    }],
    [{
      id: 'R_1',
      mark: 1,
    }],
  ]);

  snapshot('concat-space-line-after', context.map.toData(), deepEqual);

  // const line2 = new Line([[260, 140], [200, 140], [200, 120]]);

  // (line2 as any).map = map;

  // line2.setConnectionByPath();
  // line2.setMark();

  // deepEqual(line2.connections.map((item) => item.toData()), [
  //   [{
  //     id: 'R_2',
  //     mark: 0,
  //   }],
  //   [{
  //     id: 'R_1',
  //     mark: 1,
  //   }],
  // ]);

  // snapshot('concat-space-line-after', map.toData(), deepEqual);
});

test('加载完整图纸', ({ deepEqual }) => {
  const context = createContext();
  const { parts, lines } = loadData([
    {
      kind: 'Diode',
      id: 'VD_1',
      position: [700, 200],
      rotate: [[1, 0], [0, 1]],
    },
    {
      kind: 'Diode',
      id: 'VD_2',
      position: [780, 200],
      rotate: [[1, 0], [0, 1]],
    },
    {
      kind: 'Diode',
      id: 'VD_3',
      position: [700, 440],
      rotate: [[1, 0], [0, 1]],
    },
    {
      kind: 'Diode',
      id: 'VD_4',
      position: [780, 440],
      rotate: [[1, 0], [0, 1]],
    },
    {
      kind: 'AcVoltageSource',
      id: 'V_1',
      position: [580, 320],
      rotate: [[1, 0], [0, 1]],
    },
    {
      kind: 'Capacitor',
      id: 'C_1',
      position: [900, 320],
      rotate: [[0, 1], [-1, 0]],
    },
    {
      kind: 'Resistance',
      id: 'R_1',
      position: [960, 320],
      rotate: [[0, 1], [-1, 0]],
    },
    {
      kind: 'CurrentMeter',
      id: 'I_out',
      position: [840, 140],
      rotate: [[1, 0], [0, 1]],
    },
    {
      kind: 'VoltageMeter',
      id: 'V_out',
      position: [1040, 320],
      rotate: [[1, 0], [0, 1]],
    },
    {
      kind: 'VoltageMeter',
      id: 'V_in',
      position: [640, 320],
      rotate: [[1, 0], [0, 1]],
    },
    {
      kind: 'ReferenceGround',
      id: 'GND_1',
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
  ], context);

  const partConnections = parts.map((item) => item.connections.map((data) => data.toData()));
  const lineConnections = lines.map((item) => item.connections.map((data) => data.toData()));
  const data = {
    map: context.map.toData(),
    connection: {
      parts: partConnections,
      lines: lineConnections,
    },
  };

  snapshot('whole-map-data', data, deepEqual);
});
