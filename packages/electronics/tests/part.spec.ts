import test from 'ava';

import { Part } from '../src';
import { MarkNodeKind } from '@circuit/map';

test('器件的图纸标记', ({ deepEqual }) => {
  const position = [100, 100];
  const partId = 'R_1';
  const part = new Part({
    id: partId,
    kind: 'Resistance',
    position,
  });

  part.setMark();

  for (let i = 0; i < 2; i++) {
    const add = [-40, 40][i];
    const pointPosition = [position[0] + add, position[1]] as [number, number];
    deepEqual(part.map.get(pointPosition)?.toData(), {
      label: partId,
      kind: MarkNodeKind.PartPoint,
      position: pointPosition,
      connect: [],
      mark: i,
    });
  }

  for (let i = 0; i < 3; i++) {
    const add = [-20, 0, 20][i];
    const pointPosition = [position[0] + add, position[1]] as [number, number];
    deepEqual(part.map.get(pointPosition)?.toData(), {
      label: partId,
      kind: MarkNodeKind.Part,
      position: pointPosition,
      connect: [],
      mark: -1,
    });
  }
});
