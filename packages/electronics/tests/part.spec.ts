import test from 'ava';

import { Part } from '../src';
import { snapshot } from './utils';

test('器件图纸标记', ({ deepEqual }) => {
  const position = [100, 100];
  const partId = 'R_1';
  const part = new Part({
    id: partId,
    kind: 'Resistance',
    position,
  });

  part.setMark();

  snapshot('part-single-mark', part.map.toData(), deepEqual);
});
