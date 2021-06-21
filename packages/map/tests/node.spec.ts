import test from 'ava';

import { MarkMap, MarkNodeKind, NodeInputData } from '../src';

test('data normalization', ({ deepEqual }) => {
  const map = new MarkMap();
  const position = [100, 100] as [number, number];
  const id = 'test-1';
  const inputData: NodeInputData = {
    id,
    position,
  };

  map.set(inputData);

  deepEqual(map.get(position)!.toData(), {
    labels: [{
      id,
      mark: -1,
    }],
    kind: 'Part',
    position,
    connections: [],
  });
});

test('connections', ({ deepEqual, true: isTrue, false: isFalse }) => {
  const map = new MarkMap();
  const position = [100, 100];
  const node = map.set({
    id: 'test-1',
    position,
  });

  deepEqual(node.connections.length, 0);
  node.connections.add([100, 200]);
  isTrue(node.connections.has([100, 200]));
  isFalse(node.connections.has([100, 300]));
  node.connections.add([100, 300]);
  node.connections.delete([100, 200]);
  isFalse(node.connections.has([100, 200]));
  isTrue(node.connections.has([100, 300]));
});

test('标签默认行为', ({ is }) => {
  const map = new MarkMap();
  const node = map.set({
    id: 'test-1',
    position: [100, 100],
  });

  is(node.kind, MarkNodeKind.Part);
});

test('变更标签为器件引脚', ({ is, deepEqual }) => {
  const map = new MarkMap();
  const node = map.set({
    id: 'test-1',
    position: [100, 100],
  });

  node.labels.delete('test-1');
  node.labels.add('test-1', 2);

  is(node.kind, MarkNodeKind.PartPin);
  deepEqual(node.labels.toData(), [{
    id: 'test-1',
    mark: 2,
  }]);
});

test('节点是器件占据时，优先级高', ({ is, deepEqual }) => {
  const map = new MarkMap();
  const node = map.set({
    id: 'line_1',
    position: [100, 100],
  });

  is(node.kind, MarkNodeKind.Line);
  node.labels.add('R_1', 2);
  is(node.kind, MarkNodeKind.PartPin);
  deepEqual(node.labels.toData(), [
    {
      id: 'line_1',
      mark: -1,
    },
    {
      id: 'R_1',
      mark: 2,
    },
  ]);
});

test('单个导线', ({ is }) => {
  const map = new MarkMap();
  const node = map.set({
    id: 'line_1',
    position: [100, 100],
  });

  is(node.kind, MarkNodeKind.Line);
  node.labels.delete('line_1');
  node.labels.add('line_1', 0);
  is(node.kind, MarkNodeKind.LineSpacePoint);
});

test('交错节点', ({ is }) => {
  const map = new MarkMap();
  const node = map.set({
    id: 'line_1',
    mark: 1,
    position: [100, 100],
  });

  is(node.kind, MarkNodeKind.LineSpacePoint);
  node.labels.add('line_2', 1);
  node.labels.add('line_3', 0);
  is(node.kind, MarkNodeKind.LineCrossPoint);
});

test('交叠节点', ({ is }) => {
  const map = new MarkMap();
  const node = map.set({
    id: 'line_1',
    position: [100, 100],
  });

  is(node.kind, MarkNodeKind.Line);
  node.labels.add('line_2');
  is(node.kind, MarkNodeKind.LineCoverPoint);
});
