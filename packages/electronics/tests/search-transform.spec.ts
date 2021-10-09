import test from 'ava';

import { Point } from '@circuit/math';
import { TransformSearcher } from '../src';
import { loadData, createContext } from './utils';

/**
 * xxxxx ---┐
 *       <- | ->
 * xxxxx ---┘
 */
test('普通变形', ({ deepEqual }) => {
  const context = createContext();
  const result = loadData([
    {
      id: 'R_1',
      kind: 'Resistance',
      position: [100, 100],
    },
    {
      id: 'R_2',
      kind: 'Resistance',
      position: [100, 160],
    },
    {
      id: 'line_1',
      kind: 'Line',
      path: [
        [140, 100],
        [200, 100],
        [200, 160],
        [140, 160],
      ],
    },
  ], context);

  const line = result.lines[0];
  const searcher = new TransformSearcher(new Point(204, 132), 1, line);

  line.deleteMark();

  let path = searcher.search(new Point(244, 140));

  deepEqual(path.toData(), [
    [140, 100],
    [244, 100],
    [244, 160],
    [140, 160],
  ]);

  path = searcher.search(new Point(176, 200));

  deepEqual(path.toData(), [
    [140, 100],
    [176, 100],
    [176, 160],
    [140, 160],
  ]);

  path = searcher.search(new Point(145, 200));

  deepEqual(path.toData(), [
    [140, 100],
    [145, 100],
    [145, 160],
    [140, 160],
  ]);
});
