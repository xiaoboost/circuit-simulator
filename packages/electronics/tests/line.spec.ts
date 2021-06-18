import test from 'ava';

import { globalMap } from '../src/base';
import { snapshot, loadPart, loadLine } from './utils';

test.beforeEach(() => {
  globalMap.clear();
});

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

test('连接悬空导线', ({ pass }) => {
  loadPart('R_1', [100, 100]);
  loadPart('R_2', [300, 140]);
  const line1 = loadLine('line_1', [[140, 100], [200, 100], [200, 120]]);
  const line2 = loadLine('line_2', [[260, 140], [200, 140], [200, 120]]);

});

test('拆分导线', ({ pass }) => {
  pass();
});
