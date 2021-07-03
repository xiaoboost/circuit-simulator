import test from 'ava';

import { loadData, createContext } from './utils';

test('器件图纸标记', ({ snapshot }) => {
  const context = createContext();

  loadData([
    {
      id: 'R_1',
      kind: 'Resistance',
      position: [100, 100],
    }
  ], context);

  snapshot(context.map.toData());
});

test('变更器件编号', ({ snapshot }) => {
  const context = createContext();
  const { parts, lines } = loadData([
    {
      id: 'R_1',
      kind: 'Resistance',
      position: [100, 100],
    },
    {
      kind: 'Line',
      path: [[140, 100], [200, 100]],
    },
    {
      kind: 'Line',
      path: [[60, 100], [0, 100]],
    }
  ], context);

  parts[0].changeId('R_2');

  snapshot(parts.map((item) => item.connections.map((item) => item.toData())));
  snapshot(lines.map((item) => item.connections.map((item) => item.toData())));
  snapshot(context.map.toData());
});
