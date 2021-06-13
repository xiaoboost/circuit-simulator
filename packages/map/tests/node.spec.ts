import test from 'ava';

import { MarkMap, MarkNodeKind, NodeInputData } from '../src';

test('data normalization', ({ deepEqual }) => {
  const map = new MarkMap();
  const position = [100, 100] as [number, number];
  const label = 'test-1';
  const inputData: NodeInputData = {
    label,
    position,
    kind: MarkNodeKind.Part,
  };

  map.set(inputData);

  deepEqual(map.get(position)!.toData(), {
    labels: [{
      id: label,
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
    label: 'test-1',
    position,
    kind: MarkNodeKind.Part,
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
