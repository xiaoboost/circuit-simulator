import test from 'ava';
import { Point } from '@circuit/math';
import { MarkMap, MarkKind } from '../src';

test('基础功能', ({ true: isTrue, false: isFalse }) => {
  const map = new MarkMap();
  const position = [100, 100];

  map.set(position, {
    kind: MarkKind.LinePoint,
    line: 'line_1',
  });

  isTrue(map.has(position));
  isTrue(Boolean(map.get(position)));
  map.delete(position);
  isFalse(map.has(position));
});

test('设置空导线', ({ deepEqual }) => {
  const map = new MarkMap();
  const line = 'line_1';
  const linePath = [[100, 100], [120, 100], [140, 100], [140, 120], [140, 140]].map(Point.from);

  map.setLineMark(line, linePath);

  deepEqual(map.toData(), [
    {
      kind: MarkKind.LinePoint,
      line,
      position: [100, 100],
      connection: [0, 1, 0, 0],
    },
    {
      kind: MarkKind.Line,
      position: [120, 100],
      line,
      connection: [0, 1, 0, 1],
    },
    {
      kind: MarkKind.Line,
      position: [140, 100],
      line,
      connection: [0, 0, 1, 1],
    },
    {
      kind: MarkKind.Line,
      position: [140, 120],
      line,
      connection: [1, 0, 1, 0],
    },
    {
      kind: MarkKind.LinePoint,
      position: [140, 140],
      line,
      connection: [1, 0, 0, 0],
    }
  ]);
});

test('两条空导线合并为交错节点', ({ deepEqual }) => {
  const map = new MarkMap();
  const line1 = 'line_1';
  const line2 = 'line_2';
  const line1Path = [[100, 100], [120, 100], [140, 100]].map(Point.from);
  const line2Path = [[140, 100], [140, 120]].map(Point.from);

  map.setLineMark(line1, line1Path);
  map.setLineMark(line2, line2Path);

  deepEqual(map.toData(), [
    {
      kind: MarkKind.LinePoint,
      line: line1,
      position: [100, 100],
      connection: [0, 1, 0, 0],
    },
    {
      kind: MarkKind.Line,
      position: [120, 100],
      line: line1,
      connection: [0, 1, 0, 1],
    },
    {
      kind: MarkKind.LineCross,
      position: [140, 100],
      lines: [line1, line2],
      connection: [0, 0, 1, 1],
    },
    {
      kind: MarkKind.LinePoint,
      position: [140, 120],
      line: line2,
      connection: [1, 0, 0, 0],
    }
  ]);
});

test('三条空导线合并为交错节点', ({ deepEqual }) => {
  const map = new MarkMap();
  const line1 = 'line_1';
  const line2 = 'line_2';
  const line3 = 'line_3';
  const line1Path = [[100, 100], [120, 100], [140, 100]].map(Point.from);
  const line2Path = [[140, 100], [140, 120]].map(Point.from);
  const line3Path = [[140, 100], [140, 80]].map(Point.from);

  map.setLineMark(line1, line1Path);
  map.setLineMark(line2, line2Path);
  map.setLineMark(line3, line3Path);

  deepEqual(map.toData(), [
    {
      kind: MarkKind.LinePoint,
      line: line3,
      position: [140, 80],
      connection: [0, 0, 1, 0],
    },
    {
      kind: MarkKind.LinePoint,
      line: line1,
      position: [100, 100],
      connection: [0, 1, 0, 0],
    },
    {
      kind: MarkKind.Line,
      position: [120, 100],
      line: line1,
      connection: [0, 1, 0, 1],
    },
    {
      kind: MarkKind.LineCross,
      position: [140, 100],
      lines: [line1, line2, line3],
      connection: [1, 0, 1, 1],
    },
    {
      kind: MarkKind.LinePoint,
      position: [140, 120],
      line: line2,
      connection: [1, 0, 0, 0],
    }
  ]);
});

test('十字交叉的交叠节点', ({ deepEqual }) => {
  const map = new MarkMap();
  const line1 = 'line_1';
  const line2 = 'line_2';
  const line1Path = [[100, 100], [120, 100], [140, 100]].map(Point.from);
  const line2Path = [[120, 80], [120, 100], [120, 120]].map(Point.from);

  map.setLineMark(line1, line1Path);
  map.setLineMark(line2, line2Path);

  deepEqual(map.toData(), [
    {
      kind: MarkKind.LinePoint,
      line: line2,
      position: [120, 80],
      connection: [0, 0, 1, 0],
    },
    {
      kind: MarkKind.LinePoint,
      position: [100, 100],
      line: line1,
      connection: [0, 1, 0, 0],
    },
    {
      kind: MarkKind.LineCover,
      position: [120, 100],
      lines: [line1, line2],
      connections: [
        {
          id: line1,
          data: [0, 1, 0, 1],
        },
        {
          id: line2,
          data: [1, 0, 1, 0],
        },
      ],
    },
    {
      kind: MarkKind.LinePoint,
      position: [140, 100],
      line: line1,
      connection: [0, 0, 0, 1],
    },
    {
      kind: MarkKind.LinePoint,
      position: [120, 120],
      line: line2,
      connection: [1, 0, 0, 0],
    },
  ]);
});

test('两个直角导线交叠节点', ({ deepEqual }) => {
  const map = new MarkMap();
  const line1 = 'line_1';
  const line2 = 'line_2';
  const line1Path = [[100, 100], [120, 100], [120, 120]].map(Point.from);
  const line2Path = [[120, 80], [120, 100], [140, 100]].map(Point.from);

  map.setLineMark(line1, line1Path);
  map.setLineMark(line2, line2Path);

  deepEqual(map.toData(), [
    {
      kind: MarkKind.LinePoint,
      line: line2,
      position: [120, 80],
      connection: [0, 0, 1, 0],
    },
    {
      kind: MarkKind.LinePoint,
      position: [100, 100],
      line: line1,
      connection: [0, 1, 0, 0],
    },
    {
      kind: MarkKind.LineCover,
      position: [120, 100],
      lines: [line1, line2],
      connections: [
        {
          id: line1,
          data: [0, 0, 1, 1],
        },
        {
          id: line2,
          data: [1, 1, 0, 0],
        },
      ],
    },
    {
      kind: MarkKind.LinePoint,
      position: [140, 100],
      line: line2,
      connection: [0, 0, 0, 1],
    },
    {
      kind: MarkKind.LinePoint,
      position: [120, 120],
      line: line1,
      connection: [1, 0, 0, 0],
    },
  ]);
});
