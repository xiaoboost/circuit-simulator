import test from 'ava';
import { MarkMap, MarkKind, LineMark, LineCrossMark, LineCoverMark } from '../src';

function setLinePoint(map: MarkMap, id: string, linePath: number[][]) {
  const nodes= linePath.map((position) => {
    if (!map.has(position)) {
      map.set(position, {
        kind: MarkKind.Line,
        line: id,
      });
    }

    return map.get<LineMark>(position)!;
  });

  for (let i = 0; i < nodes.length; i++) {
    const last = nodes[i - 1];
    const current = nodes[i];
    const next = nodes[i + 1];

    if (last) {
      last.addConnect(current.position);
      current.addConnect(last.position);
    }

    if (next) {
      current.addConnect(next.position);
      next.addConnect(current.position);
    }
  }

  return nodes;
}

test('器件节点', ({ deepEqual }) => {
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

test('导线交错节点', ({ deepEqual }) => {
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

test('普通导线的连接关系', ({ true: isTrue, false: isFalse }) => {
  const map = new MarkMap();
  const node1 = [100, 100];
  const node2 = [120, 100];

  map.set(node1, {
    kind: MarkKind.Line,
    line: 'line_1',
  });

  map.set(node2, {
    kind: MarkKind.Line,
    line: 'line_2',
  });

  const line1 = map.get<LineMark>(node1)!;
  const line2 = map.get<LineMark>(node2)!;

  isFalse(line1.isConnect(line2.position));
  isFalse(line2.isConnect(line1.position));

  line1.addConnect(line2.position);

  isTrue(line1.isConnect(line2.position));
  isFalse(line2.isConnect(line1.position));

  line2.addConnect(line1.position);

  isTrue(line1.isConnect(line2.position));
  isTrue(line2.isConnect(line1.position));

  line1.deleteConnect(line2.position);
  line2.deleteConnect(line1.position);

  isFalse(line1.isConnect(line2.position));
  isFalse(line2.isConnect(line1.position));
});

test('普通导线和交错节点之间的连接关系', ({ true: isTrue, false: isFalse }) => {
  const map = new MarkMap();
  const node1 = [100, 100];
  const node2 = [120, 100];

  map.set(node1, {
    kind: MarkKind.Line,
    line: 'line_1',
  });

  map.set(node2, {
    kind: MarkKind.LineCross,
    lines: ['line_1', 'line_2'],
  });

  const line1 = map.get<LineMark>(node1)!;
  const line2 = map.get<LineCrossMark>(node2)!;

  isFalse(line1.isConnect(line2.position));
  isFalse(line2.isConnect(line1.position));

  line1.addConnect(line2.position);

  isTrue(line1.isConnect(line2.position));
  isFalse(line2.isConnect(line1.position));

  line2.addConnect(line1.position);

  isTrue(line1.isConnect(line2.position));
  isTrue(line2.isConnect(line1.position));

  line1.deleteConnect(line2.position);
  line2.deleteConnect(line1.position);

  isFalse(line1.isConnect(line2.position));
  isFalse(line2.isConnect(line1.position));
});

test('普通导线和交叠节点之间的连接关系', ({ true: isTrue, false: isFalse }) => {
  const map = new MarkMap();
  const node1 = [100, 100];
  const node2 = [120, 100];
  const node3 = [140, 100];

  map.set(node1, {
    kind: MarkKind.Line,
    line: 'line_1',
  });

  map.set(node2, {
    kind: MarkKind.LineCover,
    lines: ['line_1', 'line_2'],
  });

  map.set(node3, {
    kind: MarkKind.LineCover,
    lines: ['line_3'],
  });

  const line1 = map.get<LineMark>(node1)!;
  const line2 = map.get<LineCoverMark>(node2)!;
  const line3 = map.get<LineCoverMark>(node3)!;

  isFalse(line1.isConnect(line2.position));
  isFalse(line1.isConnect(line3.position));
  isTrue(line2.hasLine(line1.line));
  isFalse(line3.hasLine(line1.line));

  line2.addConnect(line1.position, 'line_1');
  line3.addConnect(line1.position, 'line_1');

  isTrue(line2.isConnect(line1.position));
  isFalse(line3.isConnect(line1.position));
});

test('沿着导线方向的终点', ({ deepEqual }) => {
  const map = new MarkMap();
  const nodes= setLinePoint(map, 'line_1', [
    [100, 100],
    [120, 100],
    [140, 100],
    [160, 100],
    [180, 100],
    [180, 120],
    [180, 140],
  ]);

  // 沿着导线方向，结果是导线终点
  deepEqual(nodes[0].alongLineAndVector([1, 0]).position.toData(), [180, 100]);
  // 未沿着导线方向，结果是起点
  deepEqual(nodes[0].alongLineAndVector([0, 1]).position.toData(), [100, 100]);
});

test('沿着导线方向，途经交错节点', ({ deepEqual }) => {
  const map = new MarkMap();

  // 左
  setLinePoint(map, 'line_1', [
    [60, 100],
    [80, 100],
  ]);

  // 右
  setLinePoint(map, 'line_2', [
    [120, 100],
    [140, 100],
  ]);

  // 上
  setLinePoint(map, 'line_1', [
    [100, 60],
    [100, 80],
  ]);

  // 下
  setLinePoint(map, 'line_2', [
    [100, 120],
    [100, 140],
  ]);

  map.set([100, 100], {
    kind: MarkKind.LineCross,
    lines: ['line_1', 'line_2', 'line_3', 'line_4'],
  });

  const center = map.get<LineCrossMark>([100, 100])!;
  const left = map.get<LineMark>([80, 100])!;
  const right = map.get<LineMark>([120, 100])!;
  const top = map.get<LineMark>([100, 80])!;
  const bottom = map.get<LineMark>([100, 120])!;

  [left, right, top, bottom].map((item) => {
    center.addConnect(item.position);
    item.addConnect(center.position);
  });

  // 从左往右
  deepEqual(
    map.get<LineMark>([60, 100])!
      .alongLineAndVector([1, 0])
      .position
      .toData(),
    [140, 100],
  );

  // 从右往左
  deepEqual(
    map.get<LineMark>([140, 100])!
      .alongLineAndVector([-1, 0])
      .position
      .toData(),
    [60, 100],
  );

  // 从上往下
  deepEqual(
    map.get<LineMark>([100, 60])!
      .alongLineAndVector([0, 1])
      .position
      .toData(),
    [100, 140],
  );

  // 从下往上
  deepEqual(
    map.get<LineMark>([100, 140])!
      .alongLineAndVector([0, -1])
      .position
      .toData(),
    [100, 60],
  );
});

test('沿着导线方向，途经十字交叠节点', ({ deepEqual }) => {
  const map = new MarkMap();

  // 左
  setLinePoint(map, 'line_1', [
    [60, 100],
    [80, 100],
  ]);

  // 右
  setLinePoint(map, 'line_2', [
    [120, 100],
    [140, 100],
  ]);

  // 上
  setLinePoint(map, 'line_1', [
    [100, 60],
    [100, 80],
  ]);

  // 下
  setLinePoint(map, 'line_2', [
    [100, 120],
    [100, 140],
  ]);

  map.set([100, 100], {
    kind: MarkKind.LineCover,
    lines: ['line_1', 'line_2'],
  });

  const center = map.get<LineCoverMark>([100, 100])!;
  const left = map.get<LineMark>([80, 100])!;
  const right = map.get<LineMark>([120, 100])!;
  const top = map.get<LineMark>([100, 80])!;
  const bottom = map.get<LineMark>([100, 120])!;

  [left, right].map((item) => {
    center.addConnect(item.position, 'line_1');
    item.addConnect(center.position);
  });

  [top, bottom].map((item) => {
    center.addConnect(item.position, 'line_2');
    item.addConnect(center.position);
  });

  // 从左往右
  deepEqual(
    map.get<LineMark>([60, 100])!
      .alongLineAndVector([1, 0])
      .position
      .toData(),
    [140, 100],
  );

  // 从右往左
  deepEqual(
    map.get<LineMark>([140, 100])!
      .alongLineAndVector([-1, 0])
      .position
      .toData(),
    [60, 100],
  );

  // 从上往下
  deepEqual(
    map.get<LineMark>([100, 60])!
      .alongLineAndVector([0, 1])
      .position
      .toData(),
    [100, 140],
  );

  // 从下往上
  deepEqual(
    map.get<LineMark>([100, 140])!
      .alongLineAndVector([0, -1])
      .position
      .toData(),
    [100, 60],
  );
});

test('沿着导线方向，途经直角交叠节点', ({ deepEqual }) => {
  const map = new MarkMap();

  // 左
  setLinePoint(map, 'line_1', [
    [60, 100],
    [80, 100],
  ]);

  // 右
  setLinePoint(map, 'line_2', [
    [120, 100],
    [140, 100],
  ]);

  // 上
  setLinePoint(map, 'line_1', [
    [100, 60],
    [100, 80],
  ]);

  // 下
  setLinePoint(map, 'line_2', [
    [100, 120],
    [100, 140],
  ]);

  map.set([100, 100], {
    kind: MarkKind.LineCover,
    lines: ['line_1', 'line_2'],
  });

  const center = map.get<LineCoverMark>([100, 100])!;
  const left = map.get<LineMark>([80, 100])!;
  const right = map.get<LineMark>([120, 100])!;
  const top = map.get<LineMark>([100, 80])!;
  const bottom = map.get<LineMark>([100, 120])!;

  [left, top].map((item) => {
    center.addConnect(item.position, 'line_1');
    item.addConnect(center.position);
  });

  [right, bottom].map((item) => {
    center.addConnect(item.position, 'line_2');
    item.addConnect(center.position);
  });

  // 从左往右
  deepEqual(
    map.get<LineMark>([60, 100])!
      .alongLineAndVector([1, 0])
      .position
      .toData(),
    [100, 100],
  );

  // 从右往左
  deepEqual(
    map.get<LineMark>([140, 100])!
      .alongLineAndVector([-1, 0])
      .position
      .toData(),
    [100, 100],
  );

  // 从上往下
  deepEqual(
    map.get<LineMark>([100, 60])!
      .alongLineAndVector([0, 1])
      .position
      .toData(),
    [100, 100],
  );

  // 从下往上
  deepEqual(
    map.get<LineMark>([100, 140])!
      .alongLineAndVector([0, -1])
      .position
      .toData(),
    [100, 100],
  );
});
