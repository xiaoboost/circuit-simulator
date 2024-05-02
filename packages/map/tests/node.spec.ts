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

// test('引脚连接导线', ({ is, deepEqual }) => {
//   const map = new MarkMap();
//   const part = 'part_1';
//   const line = 'line_1';
//   const partPin = 1;
//   const position = [100, 100];
//   const mark = getMarkFromData(map, {
//     kind: MarkKind.PartPin,
//     part,
//     pin: partPin,
//     position,
//   });

//   const newMark = mark.connectLine(line, MarkKind.PartPinLineLeft);

//   is(mark.inMap, false);
//   is(newMark.inMap, true);

//   deepEqual(newMark.toData(), {
//     line,
//     part,
//     pin: partPin,
//     kind: MarkKind.PartPinLineLeft,
//     position,
//   });
// });

// test('引脚移除导线', ({ is, deepEqual }) => {
//   const map = new MarkMap();
//   const part = 'part_1';
//   const line = 'line_1';
//   const partPin = 1;
//   const position = [100, 100];
//   const mark = getMarkFromData(map, {
//     kind: MarkKind.PartPinLineLeft,
//     part,
//     line,
//     pin: partPin,
//     position,
//   });

//   const newMark = mark.removeLine();

//   is(mark.inMap, false);
//   is(newMark.inMap, true);

//   deepEqual(newMark.toData(), {
//     part,
//     pin: partPin,
//     kind: MarkKind.PartPin,
//     position,
//   });
// });

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

// test('connections', ({ deepEqual, true: isTrue, false: isFalse }) => {
//   const map = new MarkMap();
//   const position = [100, 100];
//   const node = map.set({
//     id: 'test-1',
//     position,
//   });

//   deepEqual(node.connections.length, 0);
//   node.connections.add([100, 200]);
//   isTrue(node.connections.has([100, 200]));
//   isFalse(node.connections.has([100, 300]));
//   node.connections.add([100, 300]);
//   node.connections.delete([100, 200]);
//   isFalse(node.connections.has([100, 200]));
//   isTrue(node.connections.has([100, 300]));
// });

// test('标签默认行为', ({ is }) => {
//   const map = new MarkMap();
//   const node = map.set({
//     id: 'test-1',
//     position: [100, 100],
//   });

//   is(node.kind, MarkKind.Part);
// });

// test('变更标签为器件引脚', ({ is, deepEqual }) => {
//   const map = new MarkMap();
//   const node = map.set({
//     id: 'test-1',
//     position: [100, 100],
//   });

//   node.labels.delete('test-1');
//   node.labels.add('test-1', 2);

//   is(node.kind, MarkKind.PartPin);
//   deepEqual(node.labels.toData(), [{
//     id: 'test-1',
//     mark: 2,
//   }]);
// });

// test('节点是器件占据时，优先级高', ({ is, deepEqual }) => {
//   const map = new MarkMap();
//   const node = map.set({
//     id: 'line_1',
//     position: [100, 100],
//   });

//   is(node.kind, MarkKind.Line);
//   node.labels.add('R_1', 2);
//   is(node.kind, MarkKind.PartPin);
//   deepEqual(node.labels.toData(), [
//     {
//       id: 'line_1',
//       mark: -1,
//     },
//     {
//       id: 'R_1',
//       mark: 2,
//     },
//   ]);
// });

// test('单个导线', ({ is }) => {
//   const map = new MarkMap();
//   const node = map.set({
//     id: 'line_1',
//     position: [100, 100],
//   });

//   is(node.kind, MarkKind.Line);
//   node.labels.delete('line_1');
//   node.labels.add('line_1', 0);
//   is(node.kind, MarkKind.LineSpacePoint);
// });

// test('交错节点', ({ is }) => {
//   const map = new MarkMap();
//   const node = map.set({
//     id: 'line_1',
//     mark: 1,
//     position: [100, 100],
//   });

//   is(node.kind, MarkKind.LineSpacePoint);
//   node.labels.add('line_2', 1);
//   node.labels.add('line_3', 0);
//   is(node.kind, MarkKind.LineCrossPoint);
// });

// test('交叠节点', ({ is }) => {
//   const map = new MarkMap();
//   const node = map.set({
//     id: 'line_1',
//     position: [100, 100],
//   });

//   is(node.kind, MarkKind.Line);
//   node.labels.add('line_2');
//   is(node.kind, MarkKind.LineCoverPoint);
// });
