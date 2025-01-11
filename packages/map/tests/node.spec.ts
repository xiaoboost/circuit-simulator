import test from 'ava';

import { Point } from '@circuit/math';
import { MarkMap, MarkKind, getMarkFromData, LineAndPointMark } from '../src';

test('器件节点', ({ deepEqual, pass }) => {
  const map = new MarkMap();
  const position = [100, 100];
  const id = 'test-1';

  map.set(position, {
    kind: MarkKind.Part,
    part: id,
  });

  deepEqual(map.get(position)!.toData(), {
    part: id,
    kind: MarkKind.Part,
    position,
  });
});

test('导线交错节点', ({ deepEqual, pass }) => {
  const map = new MarkMap();
  const position = [100, 100];
  const id = ['line_1', 'line_2'];

  map.set(position, {
    kind: MarkKind.LineCross,
    lines: id,
  });

  deepEqual(map.get(position)!.toData(), {
    lines: id,
    kind: MarkKind.LineCross,
    position,
    connection: [0, 0, 0, 0],
  });
});

test('沿着导线方向的终点', ({ deepEqual }) => {
  const map = new MarkMap();
  const linePath = [[100, 100], [120, 100], [140, 100], [160, 100], [180, 100], [180, 120], [180, 140]].map(Point.from);

  map.setLineMark('line_1', linePath);

  const startNode = map.get<LineAndPointMark>([100, 100])!;

  // 沿着导线方向，结果是导线终点
  deepEqual(startNode.alongLineAndVector([1, 0]).position.toData(), [180, 100]);
  // 未沿着导线方向，结果是起点
  deepEqual(startNode.alongLineAndVector([0, 1]).position.toData(), [100, 100]);
});

test('沿着导线方向，途经交错节点', ({ deepEqual }) => {
  const map = new MarkMap();
  const line1Path = [[100, 100], [120, 100], [140, 100], [160, 100], [180, 100]].map(Point.from);
  const line2Path = [[140, 80], [140, 100], [140, 120]].map(Point.from);

  map.setLineMark('line_1', line1Path);
  map.setLineMark('line_2', line2Path);

  const startNode = map.get<LineAndPointMark>([100, 100])!;

  deepEqual(startNode.alongLineAndVector([1, 0]).position.toData(), [180, 100]);
});

test('沿着导线方向，途经十字交叠节点', ({ deepEqual }) => {
  const map = new MarkMap();
  const line1Path = [[100, 100], [120, 100], [140, 100], [160, 100], [180, 100]].map(Point.from);
  const line2Path = [[140, 60], [140, 80], [140, 100], [140, 120], [140, 140]].map(Point.from);

  map.setLineMark('line_1', line1Path);
  map.setLineMark('line_2', line2Path);

  const startNode = map.get<LineAndPointMark>([100, 100])!;

  deepEqual(startNode.alongLineAndVector([1, 0]).position.toData(), [180, 100]);
});

test('沿着导线方向，途经直角交叠节点', ({ deepEqual }) => {
  const map = new MarkMap();
  const line1Path = [[100, 100], [120, 100], [140, 100], [140, 120], [140, 140]].map(Point.from);
  const line2Path = [[140, 60], [140, 80], [140, 100], [160, 100], [180, 100]].map(Point.from);

  map.setLineMark('line_1', line1Path);
  map.setLineMark('line_2', line2Path);

  const startNode = map.get<LineAndPointMark>([100, 100])!;

  deepEqual(startNode.alongLineAndVector([1, 0]).position.toData(), [140, 100]);
});
