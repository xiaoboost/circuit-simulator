import { Point } from '@circuit/math';
import test from 'ava';
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
    },
  ]);

  map.deleteLineMark(line, linePath);

  deepEqual(map.toData(), []);
});

test('两条空导线合并为交错节点', ({ deepEqual }) => {
  const map = new MarkMap();
  const line1 = 'line_1';
  const line2 = 'line_2';
  const line1Path = [[100, 100], [120, 100], [140, 100]].map(Point.from);
  const line2Path = [[140, 100], [140, 120], [140, 140]].map(Point.from);

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
      kind: MarkKind.Line,
      position: [140, 120],
      line: line2,
      connection: [1, 0, 1, 0],
    },
    {
      kind: MarkKind.LinePoint,
      position: [140, 140],
      line: line2,
      connection: [1, 0, 0, 0],
    },
  ]);

  map.deleteLineMark(line1, line1Path);

  deepEqual(map.toData(), [
    {
      kind: MarkKind.LinePoint,
      position: [140, 100],
      line: line2,
      connection: [0, 0, 1, 0],
    },
    {
      kind: MarkKind.Line,
      position: [140, 120],
      line: line2,
      connection: [1, 0, 1, 0],
    },
    {
      kind: MarkKind.LinePoint,
      position: [140, 140],
      line: line2,
      connection: [1, 0, 0, 0],
    },
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
    },
  ]);

  map.deleteLineMark(line1, line1Path);

  deepEqual(map.toData(), [
    {
      kind: MarkKind.LinePoint,
      line: line3,
      position: [140, 80],
      connection: [0, 0, 1, 0],
    },
    {
      kind: MarkKind.LineCross,
      position: [140, 100],
      lines: [line2, line3],
      connection: [1, 0, 1, 0],
    },
    {
      kind: MarkKind.LinePoint,
      position: [140, 120],
      line: line2,
      connection: [1, 0, 0, 0],
    },
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

  map.deleteLineMark(line2, line2Path);

  deepEqual(map.toData(), [
    {
      kind: MarkKind.LinePoint,
      position: [100, 100],
      line: line1,
      connection: [0, 1, 0, 0],
    },
    {
      kind: MarkKind.Line,
      position: [120, 100],
      line: line1,
      connection: [0, 1, 0, 1],
    },
    {
      kind: MarkKind.LinePoint,
      position: [140, 100],
      line: line1,
      connection: [0, 0, 0, 1],
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

  map.deleteLineMark(line2, line2Path);

  deepEqual(map.toData(), [
    {
      kind: MarkKind.LinePoint,
      position: [100, 100],
      line: line1,
      connection: [0, 1, 0, 0],
    },
    {
      kind: MarkKind.Line,
      position: [120, 100],
      line: line1,
      connection: [0, 0, 1, 1],
    },
    {
      kind: MarkKind.LinePoint,
      position: [120, 120],
      line: line1,
      connection: [1, 0, 0, 0],
    },
  ]);
});

test('器件引脚连接导线', ({ deepEqual }) => {
  const map = new MarkMap();
  const line = 'line_1';
  const part = 'part_1';
  const pin = 1;
  const startNode = [100, 100];
  const linePath = [startNode, [120, 100], [140, 100], [140, 120]].map(Point.from);

  map.setPartMark(Point.from(startNode), part, pin);
  map.setLineMark(line, linePath);

  deepEqual(map.toData(), [
    {
      kind: MarkKind.PartPinLine,
      part,
      pin,
      line,
      position: startNode,
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
      kind: MarkKind.LinePoint,
      position: [140, 120],
      line,
      connection: [1, 0, 0, 0],
    },
  ]);

  map.deleteLineMark(line, linePath);

  deepEqual(map.toData(), [
    {
      kind: MarkKind.PartPin,
      part,
      pin,
      position: startNode,
    },
  ]);
});

test('三条导线构成 H 形状，删除中横导线', ({ deepEqual }) => {
  const map = new MarkMap();
  const line1 = 'line_1';
  const line2 = 'line_2';
  const line3 = 'line_3';
  const line4 = 'line_4';
  const line5 = 'line_5';
  const line1Path = [[100, 100], [100, 120], [100, 140]].map(Point.from);
  const line2Path = [[120, 100], [120, 120], [120, 140]].map(Point.from);
  const line3Path = [[100, 140], [100, 160]].map(Point.from);
  const line4Path = [[120, 140], [120, 160]].map(Point.from);
  const line5Path = [[100, 140], [120, 140]].map(Point.from);

  map.setLineMark(line1, line1Path);
  map.setLineMark(line2, line2Path);
  map.setLineMark(line3, line3Path);
  map.setLineMark(line4, line4Path);
  map.setLineMark(line5, line5Path);

  deepEqual(map.toData(), [
    {
      kind: MarkKind.LinePoint,
      line: line1,
      position: [100, 100],
      connection: [0, 0, 1, 0],
    },
    {
      kind: MarkKind.LinePoint,
      position: [120, 100],
      line: line2,
      connection: [0, 0, 1, 0],
    },
    {
      kind: MarkKind.Line,
      line: line1,
      position: [100, 120],
      connection: [1, 0, 1, 0],
    },
    {
      kind: MarkKind.Line,
      position: [120, 120],
      line: line2,
      connection: [1, 0, 1, 0],
    },
    {
      kind: MarkKind.LineCross,
      lines: [line1, line3, line5],
      position: [100, 140],
      connection: [1, 1, 1, 0],
    },
    {
      kind: MarkKind.LineCross,
      position: [120, 140],
      lines: [line2, line4, line5],
      connection: [1, 0, 1, 1],
    },
    {
      kind: MarkKind.LinePoint,
      line: line3,
      position: [100, 160],
      connection: [1, 0, 0, 0],
    },
    {
      kind: MarkKind.LinePoint,
      position: [120, 160],
      line: line4,
      connection: [1, 0, 0, 0],
    },
  ]);

  map.deleteLineMark(line5, line5Path);

  deepEqual(map.toData(), [
    {
      kind: MarkKind.LinePoint,
      line: line1,
      position: [100, 100],
      connection: [0, 0, 1, 0],
    },
    {
      kind: MarkKind.LinePoint,
      position: [120, 100],
      line: line2,
      connection: [0, 0, 1, 0],
    },
    {
      kind: MarkKind.Line,
      line: line1,
      position: [100, 120],
      connection: [1, 0, 1, 0],
    },
    {
      kind: MarkKind.Line,
      position: [120, 120],
      line: line2,
      connection: [1, 0, 1, 0],
    },
    {
      kind: MarkKind.LineCross,
      lines: [line1, line3],
      position: [100, 140],
      connection: [1, 0, 1, 0],
    },
    {
      kind: MarkKind.LineCross,
      position: [120, 140],
      lines: [line2, line4],
      connection: [1, 0, 1, 0],
    },
    {
      kind: MarkKind.LinePoint,
      line: line3,
      position: [100, 160],
      connection: [1, 0, 0, 0],
    },
    {
      kind: MarkKind.LinePoint,
      position: [120, 160],
      line: line4,
      connection: [1, 0, 0, 0],
    },
  ]);
});

test('引脚连接导线，删除引脚', ({ deepEqual }) => {
  const map = new MarkMap();
  const line = 'line_1';
  const part = 'part_1';
  const pin = 1;
  const startNode = [100, 100];
  const linePath = [startNode, [120, 100], [140, 100], [140, 120]].map(Point.from);

  map.setPartMark(Point.from(startNode), part, pin);
  map.setLineMark(line, linePath);

  deepEqual(map.toData(), [
    {
      kind: MarkKind.PartPinLine,
      part,
      pin,
      line,
      position: startNode,
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
      kind: MarkKind.LinePoint,
      position: [140, 120],
      line,
      connection: [1, 0, 0, 0],
    },
  ]);

  map.deletePartMark(Point.from(startNode));

  deepEqual(map.toData(), [
    {
      kind: MarkKind.LinePoint,
      line,
      position: startNode,
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
      kind: MarkKind.LinePoint,
      position: [140, 120],
      line,
      connection: [1, 0, 0, 0],
    },
  ]);
});
