import test from 'ava';

import { snapshot, load } from './utils';
import { Solver } from '../src/solver/solver';

test('所有器件都是原始器件', ({ deepEqual }) => {
  const context = load([
    {
      kind: 'Resistance',
      id: 'R_1',
      position: [740, 200],
      rotate: [[1, 0], [0, 1]],
      params: ['200'],
    },
    {
      kind: 'Capacitor',
      id: 'C_1',
      position: [820, 280],
      rotate: [[0, 1], [-1, 0]],
      params: ['10u'],
    },
    {
      kind: 'ReferenceGround',
      id: 'GND_1',
      position: [740, 400],
      rotate: [[1, 0], [0, 1]],
    },
    {
      kind: 'VoltageMeter',
      id: 'V_in',
      position: [660, 280],
      rotate: [[1, 0], [0, 1]],
    },
    {
      kind: 'VoltageMeter',
      id: 'V_C1',
      position: [920, 280],
      rotate: [[1, 0], [0, 1]],
    },
    {
      kind: 'AcVoltageSource',
      id: 'V_1',
      position: [560, 280],
      rotate: [[1, 0], [0, 1]],
      params: ['20', '100', '0', '0'],
    },
    {
      kind: 'Line',
      path: [[780, 200], [820, 200]],
    },
    {
      kind: 'Line',
      path: [[740, 380], [740, 360]],
    },
    {
      kind: 'Line',
      path: [[740, 360], [820, 360]],
    },
    {
      kind: 'Line',
      path: [[920, 240], [920, 200], [820, 200]],
    },
    {
      kind: 'Line',
      path: [[820, 240], [820, 200]],
    },
    {
      kind: 'Line',
      path: [[920, 320], [920, 360], [820, 360]],
    },
    {
      kind: 'Line',
      path: [[820, 320], [820, 360]],
    },
    {
      kind: 'Line',
      path: [[660, 240], [660, 200]],
    },
    {
      kind: 'Line',
      path: [[660, 320], [660, 360]],
    },
    {
      kind: 'Line',
      path: [[560, 240], [560, 200], [660, 200]],
    },
    {
      kind: 'Line',
      path: [[660, 200], [700, 200]],
    },
    {
      kind: 'Line',
      path: [[560, 320], [560, 360], [660, 360]],
    },
    {
      kind: 'Line',
      path: [[660, 360], [740, 360]],
    },
  ]);

  const solver = new Solver({
    ...context,
    end: '10m',
    step: '10u',
  });

  const data = {
    node: solver.pinToNode.toData(),
    branch: solver.pinToBranch.toData(),
  };

  snapshot('normal-electronics', data, deepEqual);
});
