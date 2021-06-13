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

  deepEqual(node.connections, []);
  node.addConnect([100, 200]);
  isTrue(node.hasConnect([100, 200]));
  isFalse(node.hasConnect([100, 300]));
  node.addConnect([100, 300]);
  node.deleteConnect([100, 200]);
  isFalse(node.hasConnect([100, 200]));
  isTrue(node.hasConnect([100, 300]));
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

  node.changeLabel({
    id: 'test-1',
  }, {
    id: 'test-1',
    mark: 2,
  });

  is(node.kind, MarkNodeKind.PartPin);
  deepEqual(node.labels, [{
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
  node.addLabel('R_1', 2);
  is(node.kind, MarkNodeKind.PartPin);
  deepEqual(node.labels, [
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
  node.changeLabel(
    { id: 'line_1' },
    { id: 'line_1', mark: 0 },
  );
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
  node.addLabel('line_2', 1);
  node.addLabel('line_3', 1);
  is(node.kind, MarkNodeKind.LineCrossPoint);
});

test('交叠节点', ({ is }) => {
  const map = new MarkMap();
  const node = map.set({
    id: 'line_1',
    position: [100, 100],
  });

  is(node.kind, MarkNodeKind.Line);
  node.addLabel('line_2');
  is(node.kind, MarkNodeKind.LineCoverPoint);
});
