import test from 'ava';

import { snapshot, loadPart, loadLine } from './utils';

test('导线图纸标记，两端器件', ({ deepEqual }) => {
  const part1 = loadPart('R_1', [100, 100]);
  const part2 = loadPart('R_2', [240, 200]);
  const line = loadLine('line_1', [[140, 100], [200, 100], [200, 200]]);

  part1.setMark();
  part2.setMark();

  line.setConnectByWay();
  line.setMark();

  snapshot('line-two-part', line.map.toData(), deepEqual);
});
