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

function loadSingle(position: [number, number]) {
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

test('绘制导线，终点为空白', ({ deepEqual }) => {
  const [, line, start, direction] = loadSingle([100, 100]);
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

test('绘制导线，终点为空白，有器件挡道', ({ deepEqual }) => {
  const [, line, start, direction] = loadSingle([100, 100]);
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
