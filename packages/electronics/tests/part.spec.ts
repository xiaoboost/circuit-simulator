import test from 'ava';

import { MarkMap } from '@circuit/map';
import { snapshot, loadParts } from './utils';

test('器件图纸标记', ({ deepEqual }) => {
  const map = new MarkMap();
  const [part] = loadParts([
    {
      id: 'R_1',
      kind: 'Resistance',
      position: [100, 100],
    }
  ], map, false);

  part.setMark();

  snapshot('part-single-mark', part.map.toData(), deepEqual);
});
