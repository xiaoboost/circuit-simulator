import test from 'ava';
import { MarkMap, MarkKind } from '../src';

test('设置/删除节点', ({ true: isTrue, false: isFalse }) => {
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
