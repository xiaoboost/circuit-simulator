import test from 'ava';

import { Part, Line, DrawPathSearcher } from '../src';
import { Point, Direction, Directions } from '@circuit/math';

function loadPart(position: [number, number]) {
  const part = new Part({
    id: 'R_1',
    kind: 'Resistance',
    position,
  });

  part.setMark();

  return part;
}

function loadBase(position: [number, number]) {
  const start = Point.from([position[0] + 40, position[1]]);
  const line = new Line([start]);
  const part = loadPart(position);

  part.connects[1] = {
    id: line.id,
    mark: 1,
  };

  line.connects[0] = {
    id: part.id,
    mark: 0,
  };

  return [part, line, start, Directions[Direction.Right]] as const;
}

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

test('终点为空白，有器件挡道', ({ deepEqual }) => {
  const [, line, start, direction] = loadBase([100, 100]);
  const searcher = new DrawPathSearcher(start, direction, line);

  loadPart([300, 300]);

  const path = searcher.search(Point.from([310, 360]), Point.from([0, 0]));

  deepEqual(path.toData(), [
    [140, 100],
    [360, 100],
    [360, 360],
    [310, 360],
  ]);
});

test('终点为器件，器件有空置引脚', ({ deepEqual }) => {
  const [, line, start, direction] = loadBase([100, 100]);
  const part = loadPart([300, 300]);
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
  const part = loadPart([300, 300]);
  const searcher = new DrawPathSearcher(start, direction, line);

  part.connects[0] = part.connects[1] = {
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
