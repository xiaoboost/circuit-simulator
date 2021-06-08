import test from 'ava';

import { Point } from '@circuit/math';
import { MarkMap, MarkNodeKind, NodeInputData } from '../src';

test('data normalization', ({ deepEqual }) => {
  const map = new MarkMap();
  const position = [100, 100];
  const label = 'test-1';
  const inputData: NodeInputData = {
    label,
    position,
    kind: MarkNodeKind.Part,
  };

  map.set(inputData);

  deepEqual(map.get(position)!.toData(), {
    label,
    kind: MarkNodeKind.Part,
    position: Point.from(position),
    connect: [],
    mark: -1,
  });
});

test('connect', ({ deepEqual, true: isTrue, false: isFalse }) => {
  const map = new MarkMap();
  const position = [100, 100];
  const node = map.set({
    label: 'test-1',
    position,
    kind: MarkNodeKind.Part,
  });

  deepEqual(node.connect, []);
  node.addConnect([100, 200]);
  isTrue(node.hasConnect([100, 200]));
  isFalse(node.hasConnect([100, 300]));
  node.addConnect([100, 300]);
  node.deleteConnect([100, 200]);
  isFalse(node.hasConnect([100, 200]));
  isTrue(node.hasConnect([100, 300]));
});
