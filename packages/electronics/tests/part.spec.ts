import test from 'ava';

import { snapshot, loadData, createContext } from './utils';

test('器件图纸标记', ({ deepEqual }) => {
  const context = createContext();

  loadData([
    {
      id: 'R_1',
      kind: 'Resistance',
      position: [100, 100],
    }
  ], context);

  snapshot('part-single-mark', context.map.toData(), deepEqual);
});
