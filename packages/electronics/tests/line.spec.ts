import test from 'ava';

import { MarkMap } from '@circuit/map';
import { snapshot, loadParts, loadLines } from './utils';
import { Line } from '../src';

test('导线图纸标记，两端器件', ({ deepEqual }) => {
  const map = new MarkMap();

  loadParts([
    {
      id: 'R_1',
      kind: 'Resistance',
      position: [100, 100],
    },
    {
      id: 'R_2',
      kind: 'Resistance',
      position: [240, 200],
    }
  ], map, false);

  loadLines([
    {
      path: [[140, 100], [200, 100], [200, 200]],
    }
  ], map, false);

  snapshot('line-two-part', map.toData(), deepEqual);
});

test('连接悬空导线', ({ deepEqual }) => {
  const map = new MarkMap();

  loadParts([
    {
      id: 'R_1',
      kind: 'Resistance',
      position: [100, 100],
    },
    {
      id: 'R_2',
      kind: 'Resistance',
      position: [300, 140],
    }
  ], map, false);

  loadLines([
    {
      path: [[140, 100], [200, 100], [200, 120]],
    }
  ], map, false);

  snapshot('concat-space-line-before', map.toData(), deepEqual);

  const line2 = new Line([[260, 140], [200, 140], [200, 120]]);

  (line2 as any).map = map;

  line2.setConnectByPin();
  line2.setMark();

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

  snapshot('concat-space-line-after', map.toData(), deepEqual);
});
