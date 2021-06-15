import test from 'ava';

import { DrawPathSearcher } from '../src';
import { Point } from '@circuit/math';

import { loadBase, loadPart } from './utils';

test('终点为空白', ({ deepEqual }) => {
  const [, line, start, direction] = loadBase([100, 100]);
  const end = Point.from([150, 110]);
  const bias = Point.from([0, 0]);
  const searcher = new DrawPathSearcher(start, direction, line);

  let path = searcher.search(end, bias);

  deepEqual(path.toData(), [
    [140, 100],
    [150, 100],
    [150, 110],
  ]);

  path = searcher.search(Point.from([500, 400]), bias);

  deepEqual(path.toData(), [
    [140, 100],
    [500, 100],
    [500, 400],
  ]);
});

/**
 * xxxxx --------┐
 *         xxxxx |
 *            ---┘
 */
test('终点为空白，有器件挡道', ({ deepEqual }) => {
  const [, line, start, direction] = loadBase([100, 100]);
  const searcher = new DrawPathSearcher(start, direction, line);

  loadPart('R_2', [300, 300]);

  const path = searcher.search(Point.from([310, 360]), Point.from([0, 0]));

  deepEqual(path.toData(), [
    [140, 100],
    [360, 100],
    [360, 360],
    [310, 360],
  ]);
});

/**
 * xxxxx┐
 *      |
 * xxxxx|
 *      ┘
 */
test('两个器件，器件在同一列，终点在下面器件右边引脚的右下角', ({ deepEqual }) => {
  const [, line, start, direction] = loadBase([100, 100]);
  const searcher = new DrawPathSearcher(start, direction, line);

  loadPart('R_2', [100, 300]);

  const path = searcher.search(Point.from([150, 310]), Point.from([0, 0]));

  deepEqual(path.toData(), [
    [140, 100],
    [160, 100],
    [160, 310],
    [150, 310],
  ]);
});

test('终点为器件，器件有空置引脚', ({ deepEqual }) => {
  const [, line, start, direction] = loadBase([100, 100]);
  const part = loadPart('R_2', [300, 300]);
  const searcher = new DrawPathSearcher(start, direction, line);

  let path = searcher.search(Point.from([200, 150]), Point.from([0, 0]));

  deepEqual(path.toData(), [
    [140, 100],
    [200, 100],
    [200, 150],
  ]);

  searcher.setMouseOver(part);

  path = searcher.search(Point.from([310, 300]), Point.from([0, 0]));

  deepEqual(path.toData(), [
    [140, 100],
    [340, 100],
    [340, 300],
  ]);

  path = searcher.search(Point.from([290, 300]), Point.from([0, 0]));

  deepEqual(path.toData(), [
    [140, 100],
    [260, 100],
    [260, 300],
  ]);

  path = searcher.search(Point.from([300, 300]), Point.from([1, 0]));

  deepEqual(path.toData(), [
    [140, 100],
    [340, 100],
    [340, 300],
  ]);

  searcher.freeMouse();

  path = searcher.search(Point.from([380, 300]), Point.from([1, 0]));

  deepEqual(path.toData(), [
    [140, 100],
    [380, 100],
    [380, 300],
  ]);
});

test('终点为器件，器件没有空置引脚', ({ deepEqual }) => {
  const [, line, start, direction] = loadBase([100, 100]);
  const part = loadPart('R_2', [300, 300]);
  const searcher = new DrawPathSearcher(start, direction, line);

  part.connections[0] = part.connections[1] = {
    id: 'test',
    mark: 0,
  };

  searcher.setMouseOver(part);

  /**
   * 器件右半靠上的坐标，这里只有三个节点
   */

  let path = searcher.search(Point.from([310, 290]), Point.from([0, 0]));

  deepEqual(path.toData(), [
    [140, 100],
    [310, 100],
    [310, 290],
  ]);

  /**
   * 器件右半靠下的坐标，路径会在这里绕一下，所以有4个节点
   */

  path = searcher.search(Point.from([310, 310]), Point.from([0, 0]));

  deepEqual(path.toData(), [
    [140, 100],
    [360, 100],
    [360, 310],
    [310, 310],
  ]);
});
