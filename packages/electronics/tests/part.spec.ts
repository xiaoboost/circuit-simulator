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
