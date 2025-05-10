import { MarkKind } from '@circuit/map';
import { RotateMatrix, Rotate, Point } from '@circuit/algorithm';
import { default as test } from 'ava';
import { LineMarker, PartMarker, SheetContext } from '../../src';

test('放置/删除器件', ({ deepEqual }) => {
  const sheet = new SheetContext();
  const partId = 'R_1';
  const data = {
    kind: 'Resistance' as const,
    id: partId,
    position: [100, 100],
  };
  const part = new PartMarker(data, sheet);

  part.setMark();
  deepEqual(sheet.markMap.toData(), [
    {
      kind: MarkKind.PartPin,
      part: partId,
      pin: 0,
      position: [60, 100],
    },
    {
      kind: MarkKind.Part,
      part: partId,
      position: [80, 100],
    },
    {
      kind: MarkKind.Part,
      part: partId,
      position: [100, 100],
    },
    {
      kind: MarkKind.Part,
      part: partId,
      position: [120, 100],
    },
    {
      kind: MarkKind.PartPin,
      part: partId,
      pin: 1,
      position: [140, 100],
    },
  ]);

  part.deleteMark();
  deepEqual(sheet.markMap.toData(), []);
});

test('放置并且旋转器件', ({ deepEqual }) => {
  const sheet = new SheetContext();
  const partId = 'R_1';
  const data = {
    kind: 'Resistance' as const,
    id: partId,
    position: [100, 100],
  };
  const part = new PartMarker(data, sheet);

  part.setMark();
  deepEqual(sheet.markMap.toData(), [
    {
      kind: MarkKind.PartPin,
      part: partId,
      pin: 0,
      position: [60, 100],
    },
    {
      kind: MarkKind.Part,
      part: partId,
      position: [80, 100],
    },
    {
      kind: MarkKind.Part,
      part: partId,
      position: [100, 100],
    },
    {
      kind: MarkKind.Part,
      part: partId,
      position: [120, 100],
    },
    {
      kind: MarkKind.PartPin,
      part: partId,
      pin: 1,
      position: [140, 100],
    },
  ]);

  part.deleteMark();
  part.rotate = RotateMatrix[Rotate.Clockwise];
  part.setMark();

  deepEqual(sheet.markMap.toData(), [
    {
      kind: MarkKind.PartPin,
      part: partId,
      pin: 0,
      position: [100, 60],
    },
    {
      kind: MarkKind.Part,
      part: partId,
      position: [100, 80],
    },
    {
      kind: MarkKind.Part,
      part: partId,
      position: [100, 100],
    },
    {
      kind: MarkKind.Part,
      part: partId,
      position: [100, 120],
    },
    {
      kind: MarkKind.PartPin,
      part: partId,
      pin: 1,
      position: [100, 140],
    },
  ]);

  part.deleteMark();
  deepEqual(sheet.markMap.toData(), []);
});

test('放置并且移动器件', ({ deepEqual }) => {
  const sheet = new SheetContext();
  const partId = 'R_1';
  const data = {
    kind: 'Resistance' as const,
    id: partId,
    position: [100, 100],
  };
  const part = new PartMarker(data, sheet);

  part.setMark();
  deepEqual(sheet.markMap.toData(), [
    {
      kind: MarkKind.PartPin,
      part: partId,
      pin: 0,
      position: [60, 100],
    },
    {
      kind: MarkKind.Part,
      part: partId,
      position: [80, 100],
    },
    {
      kind: MarkKind.Part,
      part: partId,
      position: [100, 100],
    },
    {
      kind: MarkKind.Part,
      part: partId,
      position: [120, 100],
    },
    {
      kind: MarkKind.PartPin,
      part: partId,
      pin: 1,
      position: [140, 100],
    },
  ]);

  part.deleteMark();
  part.position = part.position.add([40, 100]);
  part.setMark();

  deepEqual(sheet.markMap.toData(), [
    {
      kind: MarkKind.PartPin,
      part: partId,
      pin: 0,
      position: [100, 200],
    },
    {
      kind: MarkKind.Part,
      part: partId,
      position: [120, 200],
    },
    {
      kind: MarkKind.Part,
      part: partId,
      position: [140, 200],
    },
    {
      kind: MarkKind.Part,
      part: partId,
      position: [160, 200],
    },
    {
      kind: MarkKind.PartPin,
      part: partId,
      pin: 1,
      position: [180, 200],
    },
  ]);

  part.deleteMark();
  deepEqual(sheet.markMap.toData(), []);
});

test('变更器件编号', ({ deepEqual }) => {
  const sheet = new SheetContext();
  const partId = 'R_1';
  const data = {
    kind: 'Resistance' as const,
    id: partId,
    position: [100, 100],
  };
  const part = new PartMarker(data, sheet);

  part.changeId('R_2');

  deepEqual(sheet.markMap.toData(), [
    {
      kind: MarkKind.PartPin,
      part: 'R_2',
      pin: 0,
      position: [60, 100],
    },
    {
      kind: MarkKind.Part,
      part: 'R_2',
      position: [80, 100],
    },
    {
      kind: MarkKind.Part,
      part: 'R_2',
      position: [100, 100],
    },
    {
      kind: MarkKind.Part,
      part: 'R_2',
      position: [120, 100],
    },
    {
      kind: MarkKind.PartPin,
      part: 'R_2',
      pin: 1,
      position: [140, 100],
    },
  ]);
});

test('放下器件之前检测是否被占用', ({ true: isTrue, false: isFalse }) => {
  const sheet = new SheetContext();
  const res1 = new PartMarker({
    kind: 'Resistance',
    id: 'R_1',
    position: [100, 100],
  }, sheet);
  const res2 = new PartMarker({
    kind: 'Resistance',
    id: 'R_2',
    position: [120, 100],
  }, sheet);

  // 放下第一个器件
  res1.setMark();
  isTrue(res2.isOccupied());

  // 移动第二个器件
  res2.position = Point.from([200, 200]);
  isFalse(res2.isOccupied());
});

test('器件引脚连接导线', ({ deepEqual }) => {
  const sheet = new SheetContext();
  const lineId = 'line_1';
  const partId = 'part_1';
  const line = new LineMarker([[140, 100], [160, 100], [160, 120]], sheet);
  const part = new PartMarker({
    kind: 'Resistance',
    id: partId,
    position: [100, 100],
  }, sheet);

  part.setMark();
  line.id = lineId;
  line.setMark();

  deepEqual(sheet.markMap.toData(), [
    {
      kind: MarkKind.PartPin,
      part: partId,
      pin: 0,
      position: [60, 100],
    },
    {
      kind: MarkKind.Part,
      part: partId,
      position: [80, 100],
    },
    {
      kind: MarkKind.Part,
      part: partId,
      position: [100, 100],
    },
    {
      kind: MarkKind.Part,
      part: partId,
      position: [120, 100],
    },
    {
      kind: MarkKind.PartPinLine,
      part: partId,
      pin: 1,
      line: lineId,
      position: [140, 100],
      connection: [0, 1, 0, 0],
    },
    {
      kind: MarkKind.Line,
      position: [160, 100],
      line: lineId,
      connection: [0, 0, 1, 1],
    },
    {
      kind: MarkKind.LinePoint,
      position: [160, 120],
      line: lineId,
      connection: [1, 0, 0, 0],
    },
  ]);

  line.deleteMark();

  deepEqual(sheet.markMap.toData(), [
    {
      kind: MarkKind.PartPin,
      part: partId,
      pin: 0,
      position: [60, 100],
    },
    {
      kind: MarkKind.Part,
      part: partId,
      position: [80, 100],
    },
    {
      kind: MarkKind.Part,
      part: partId,
      position: [100, 100],
    },
    {
      kind: MarkKind.Part,
      part: partId,
      position: [120, 100],
    },
    {
      kind: MarkKind.PartPin,
      part: partId,
      pin: 1,
      position: [140, 100],
    },
  ]);
});

test('器件引脚连接导线，删除器件', ({ deepEqual }) => {
  const sheet = new SheetContext();
  const lineId = 'line_1';
  const partId = 'part_1';
  const line = new LineMarker([[140, 100], [160, 100], [160, 120]], sheet);
  const part = new PartMarker({
    kind: 'Resistance',
    id: partId,
    position: [100, 100],
  }, sheet);

  part.setMark();
  line.id = lineId;
  line.setMark();

  deepEqual(sheet.markMap.toData(), [
    {
      kind: MarkKind.PartPin,
      part: partId,
      pin: 0,
      position: [60, 100],
    },
    {
      kind: MarkKind.Part,
      part: partId,
      position: [80, 100],
    },
    {
      kind: MarkKind.Part,
      part: partId,
      position: [100, 100],
    },
    {
      kind: MarkKind.Part,
      part: partId,
      position: [120, 100],
    },
    {
      kind: MarkKind.PartPinLine,
      part: partId,
      pin: 1,
      line: lineId,
      position: [140, 100],
      connection: [0, 1, 0, 0],
    },
    {
      kind: MarkKind.Line,
      position: [160, 100],
      line: lineId,
      connection: [0, 0, 1, 1],
    },
    {
      kind: MarkKind.LinePoint,
      position: [160, 120],
      line: lineId,
      connection: [1, 0, 0, 0],
    },
  ]);

  part.deleteMark();

  deepEqual(sheet.markMap.toData(), [
    {
      kind: MarkKind.LinePoint,
      line: lineId,
      position: [140, 100],
      connection: [0, 1, 0, 0],
    },
    {
      kind: MarkKind.Line,
      position: [160, 100],
      line: lineId,
      connection: [0, 0, 1, 1],
    },
    {
      kind: MarkKind.LinePoint,
      position: [160, 120],
      line: lineId,
      connection: [1, 0, 0, 0],
    },
  ]);
});
