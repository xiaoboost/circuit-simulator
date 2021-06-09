import test from 'ava';

import { Part, Line, draw, SearchContext } from '../src';
import { Point, Direction } from '@circuit/math';

function loadSingle(position: [number, number]) {
  const start = Point.from([position[0] + 40, position[1]]);
  const line = new Line([start]);
  const part = new Part({
    id: 'R_1',
    kind: 'Resistance',
    position,
  });

  part.connects[1] = {
    id: line.id,
    mark: 1,
  };

  line.connects[0] = {
    id: part.id,
    mark: 0,
  };

  part.setMark();

  return [part, line, start, Direction.Right] as const;
}

test('绘制导线，终点为空白', ({ deepEqual }) => {
  const [, line, start, direction] = loadSingle([100, 100]);

  draw.init();

  const end = Point.from([150, 110]);
  const context: SearchContext = {
    end,
  };

  let path = draw.search(start, direction, context, line);

  deepEqual(path.toData(), [
    [140, 100],
    [150, 100],
    [150, 110],
  ]);

  context.end = Point.from([500, 400]);
  path = draw.search(start, direction, context, line);

  deepEqual(path.toData(), [
    [140, 100],
    [500, 100],
    [500, 400],
  ]);
});
