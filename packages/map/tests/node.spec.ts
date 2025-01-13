import { Point } from '@circuit/math';
import test from 'ava';
import { MarkMap, MarkKind, LineAndPointMark, LineMark } from '../src';
import { type BaseMark } from '../src/mark/base';

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

function getLineNodeAndConnectNodes(map: MarkMap, point: Point) {
  const node = map.get(point)! as LineMark;
  const left = map.get(point.add(-20, 0)) as LineMark;
  const right = map.get(point.add(20, 0)) as LineMark;
  const top = map.get(point.add(0, -20)) as LineMark;
  const bottom = map.get(point.add(0, 20)) as LineMark;

  if (left) {
    left.deleteConnect(point);
    node.deleteConnect(point);
  }

  if (right) {
    right.deleteConnect(point);
    node.deleteConnect(right.position);
  }

  if (top) {
    top.deleteConnect(point);
    node.deleteConnect(top.position);
  }

  if (bottom) {
    bottom.deleteConnect(point);
    node.deleteConnect(bottom.position);
  }

  return {
    node,
    left,
    right,
    top,
    bottom,
  };
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

// test('普通导线和交错节点之间的连接关系', ({  }) => {

// });

// test('沿着导线方向的终点', ({ deepEqual }) => {
//   const map = new MarkMap();
//   const nodes= setLinePoint(map, 'line_1', [
//     [100, 100],
//     [120, 100],
//     [140, 100],
//     [160, 100],
//     [180, 100],
//     [180, 120],
//     [180, 140],
//   ]);

//   // 沿着导线方向，结果是导线终点
//   deepEqual(nodes[0].alongLineAndVector([1, 0]).position.toData(), [180, 100]);
//   // 未沿着导线方向，结果是起点
//   deepEqual(nodes[0].alongLineAndVector([0, 1]).position.toData(), [100, 100]);
// });

// test('沿着导线方向，途经交错节点', ({ deepEqual }) => {
//   const map = new MarkMap();
//   const crossPosition = [140, 100];

//   map.set(crossPosition, {
//     kind: MarkKind.LineCross,
//     lines: ['line_1', 'line_2'],
//   });

//   const line1 = setLinePoint(map, 'line_1', [
//     [100, 100],
//     [120, 100],
//     [140, 100],
//     [160, 100],
//     [180, 100],
//   ]);

//   setLinePoint(map, 'line_2', [
//     [140, 80],
//     [140, 100],
//     [140, 120],
//   ]);


//   deepEqual(
//     line1[0]
//       .alongLineAndVector([1, 0])
//       .position
//       .toData(),
//     line1[line1.length - 1]
//       .position
//       .toData(),
//   );
// });

// test('沿着导线方向，途经十字交叠节点', ({ deepEqual }) => {
//   const map = new MarkMap();
//   const line1 = setLinePoint(map, 'line_1', [
//     [100, 100],
//     [120, 100],
//     [140, 100],
//     [160, 100],
//     [180, 100],
//   ]);
//   const line2 = setLinePoint(map, 'line_1', [
//     [140, 60],
//     [140, 80],
//     [140, 100],
//     [140, 120],
//     [140, 140],
//   ]);

//   const coverNode = getLineNodeAndConnectNodes(map, Point.from([140, 100]));

//   const startNode = map.get<LineAndPointMark>([100, 100])!;

//   deepEqual(startNode.alongLineAndVector([1, 0]).position.toData(), [180, 100]);
// });

// test('沿着导线方向，途经直角交叠节点', ({ deepEqual }) => {
//   const map = new MarkMap();
//   const line1Path = [[100, 100], [120, 100], [140, 100], [140, 120], [140, 140]].map(Point.from);
//   const line2Path = [[140, 60], [140, 80], [140, 100], [160, 100], [180, 100]].map(Point.from);

//   map.setLineMark('line_1', line1Path);
//   map.setLineMark('line_2', line2Path);

//   const startNode = map.get<LineAndPointMark>([100, 100])!;

//   deepEqual(startNode.alongLineAndVector([1, 0]).position.toData(), [140, 100]);
// });
