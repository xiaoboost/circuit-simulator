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

test('迭代顺序', ({ is }) => {
  const map = new MarkMap();
  const locations = [[100, 200], [200, 100], [100, 100], [260, 260]];

  for (let i = 0; i < locations.length; i++) {
    map.set(locations[i], {
      kind: MarkKind.Part,
      part: `part_${i + 1}`,
    });
  }

  let positionMsg = '';
  let id = '';

  for (const [point, data] of map.entries()) {
    if (data.isPart()) {
      id += `${data.part};`;
      positionMsg += `${point[0]}-${point[1]};`;
    }
  }

  is(positionMsg, '100-100;100-200;200-100;260-260;');
  is(id, 'part_3;part_1;part_2;part_4;');
});
