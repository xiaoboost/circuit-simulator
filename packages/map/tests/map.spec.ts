import test from 'ava';
import { MarkMap } from '../src';

test('basic', ({ true: isTrue, false: isFalse }) => {
  const map = new MarkMap();
  const position = [100, 100];

  map.set({
    id: 'test-1',
    position,
  });

  isTrue(map.has(position));
  isTrue(Boolean(map.get(position)));
  map.delete(position);
  isFalse(map.has(position));
});
