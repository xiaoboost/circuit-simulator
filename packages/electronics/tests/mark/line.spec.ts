import { MarkKind } from '@circuit/map';
import { default as test } from 'ava';
import { LineMarker, SheetContext } from '../../src';

test('设置空导线', ({ deepEqual }) => {
  const sheet = new SheetContext();
  const linePath = [
    [100, 100],
    [120, 100],
    [140, 100],
    [140, 120],
    [140, 140],
  ];
  const line = new LineMarker(linePath, sheet);
  const lineId = 'line_1';

  line.id = lineId;
  line.setMark();

  deepEqual(sheet.markMap.toData(), [
    {
      kind: MarkKind.LinePoint,
      line: lineId,
      position: [100, 100],
      connection: [0, 1, 0, 0],
    },
    {
      kind: MarkKind.Line,
      position: [120, 100],
      line: lineId,
      connection: [0, 1, 0, 1],
    },
    {
      kind: MarkKind.Line,
      position: [140, 100],
      line: lineId,
      connection: [0, 0, 1, 1],
    },
    {
      kind: MarkKind.Line,
      position: [140, 120],
      line: lineId,
      connection: [1, 0, 1, 0],
    },
    {
      kind: MarkKind.LinePoint,
      position: [140, 140],
      line: lineId,
      connection: [1, 0, 0, 0],
    },
  ]);

  line.deleteMark();

  deepEqual(sheet.markMap.toData(), []);
});

test('两条空导线合并为交错节点', ({ deepEqual }) => {
  const sheet = new SheetContext();
  const line1Id = 'line_1';
  const line2Id = 'line_2';
  const line1 = new LineMarker([[100, 100], [120, 100], [140, 100]], sheet);
  const line2 = new LineMarker([[140, 100], [140, 120], [140, 140]], sheet);

  line1.id = line1Id;
  line2.id = line2Id;

  line1.setMark();
  line2.setMark();

  deepEqual(sheet.markMap.toData(), [
    {
      kind: MarkKind.LinePoint,
      line: line1Id,
      position: [100, 100],
      connection: [0, 1, 0, 0],
    },
    {
      kind: MarkKind.Line,
      position: [120, 100],
      line: line1Id,
      connection: [0, 1, 0, 1],
    },
    {
      kind: MarkKind.LineCross,
      position: [140, 100],
      lines: [line1Id, line2Id],
      connection: [0, 0, 1, 1],
    },
    {
      kind: MarkKind.Line,
      position: [140, 120],
      line: line2Id,
      connection: [1, 0, 1, 0],
    },
    {
      kind: MarkKind.LinePoint,
      position: [140, 140],
      line: line2Id,
      connection: [1, 0, 0, 0],
    },
  ]);

  line1.deleteMark();

  deepEqual(sheet.markMap.toData(), [
    {
      kind: MarkKind.LinePoint,
      position: [140, 100],
      line: line2Id,
      connection: [0, 0, 1, 0],
    },
    {
      kind: MarkKind.Line,
      position: [140, 120],
      line: line2Id,
      connection: [1, 0, 1, 0],
    },
    {
      kind: MarkKind.LinePoint,
      position: [140, 140],
      line: line2Id,
      connection: [1, 0, 0, 0],
    },
  ]);
});

test('三条空导线合并为交错节点', ({ deepEqual }) => {
  const sheet = new SheetContext();
  const line1Id = 'line_1';
  const line2Id = 'line_2';
  const line3Id = 'line_3';
  const line1 = new LineMarker([[100, 100], [120, 100], [140, 100]], sheet);
  const line2 = new LineMarker([[140, 100], [140, 120]], sheet);
  const line3 = new LineMarker([[140, 100], [140, 80]], sheet);

  line1.id = line1Id;
  line2.id = line2Id;
  line3.id = line3Id;

  line1.setMark();
  line2.setMark();
  line3.setMark();

  deepEqual(sheet.markMap.toData(), [
    {
      kind: MarkKind.LinePoint,
      line: line1Id,
      position: [100, 100],
      connection: [0, 1, 0, 0],
    },
    {
      kind: MarkKind.Line,
      position: [120, 100],
      line: line1Id,
      connection: [0, 1, 0, 1],
    },
    {
      kind: MarkKind.LinePoint,
      line: line3Id,
      position: [140, 80],
      connection: [0, 0, 1, 0],
    },
    {
      kind: MarkKind.LineCross,
      position: [140, 100],
      lines: [line1Id, line2Id, line3Id],
      connection: [1, 0, 1, 1],
    },
    {
      kind: MarkKind.LinePoint,
      position: [140, 120],
      line: line2Id,
      connection: [1, 0, 0, 0],
    },
  ]);

  line1.deleteMark();

  deepEqual(sheet.markMap.toData(), [
    {
      kind: MarkKind.LinePoint,
      line: line3Id,
      position: [140, 80],
      connection: [0, 0, 1, 0],
    },
    {
      kind: MarkKind.LineCross,
      position: [140, 100],
      lines: [line2Id, line3Id],
      connection: [1, 0, 1, 0],
    },
    {
      kind: MarkKind.LinePoint,
      position: [140, 120],
      line: line2Id,
      connection: [1, 0, 0, 0],
    },
  ]);
});

test('十字交叉的交叠节点', ({ deepEqual }) => {
  const sheet = new SheetContext();
  const line1Id = 'line_1';
  const line2Id = 'line_2';
  const line1 = new LineMarker([[100, 100], [120, 100], [140, 100]], sheet);
  const line2 = new LineMarker([[120, 80], [120, 100], [120, 120]], sheet);

  line1.id = line1Id;
  line2.id = line2Id;

  line1.setMark();
  line2.setMark();

  deepEqual(sheet.markMap.toData(), [
    {
      kind: MarkKind.LinePoint,
      position: [100, 100],
      line: line1Id,
      connection: [0, 1, 0, 0],
    },
    {
      kind: MarkKind.LinePoint,
      line: line2Id,
      position: [120, 80],
      connection: [0, 0, 1, 0],
    },
    {
      kind: MarkKind.LineCover,
      position: [120, 100],
      lines: [line1Id, line2Id],
      connections: [
        {
          id: line1Id,
          data: [0, 1, 0, 1],
        },
        {
          id: line2Id,
          data: [1, 0, 1, 0],
        },
      ],
    },
    {
      kind: MarkKind.LinePoint,
      position: [120, 120],
      line: line2Id,
      connection: [1, 0, 0, 0],
    },
    {
      kind: MarkKind.LinePoint,
      position: [140, 100],
      line: line1Id,
      connection: [0, 0, 0, 1],
    },
  ]);

  line2.deleteMark();

  deepEqual(sheet.markMap.toData(), [
    {
      kind: MarkKind.LinePoint,
      position: [100, 100],
      line: line1Id,
      connection: [0, 1, 0, 0],
    },
    {
      kind: MarkKind.Line,
      position: [120, 100],
      line: line1Id,
      connection: [0, 1, 0, 1],
    },
    {
      kind: MarkKind.LinePoint,
      position: [140, 100],
      line: line1Id,
      connection: [0, 0, 0, 1],
    },
  ]);
});

test('两个直角导线交叠节点', ({ deepEqual }) => {
  const sheet = new SheetContext();
  const line1Id = 'line_1';
  const line2Id = 'line_2';
  const line1 = new LineMarker([[100, 100], [120, 100], [120, 120]], sheet);
  const line2 = new LineMarker([[120, 80], [120, 100], [140, 100]], sheet);

  line1.id = line1Id;
  line2.id = line2Id;

  line1.setMark();
  line2.setMark();

  deepEqual(sheet.markMap.toData(), [
    {
      kind: MarkKind.LinePoint,
      position: [100, 100],
      line: line1Id,
      connection: [0, 1, 0, 0],
    },
    {
      kind: MarkKind.LinePoint,
      line: line2Id,
      position: [120, 80],
      connection: [0, 0, 1, 0],
    },
    {
      kind: MarkKind.LineCover,
      position: [120, 100],
      lines:  [line1Id, line2Id],
      connections: [
        {
          id: line1Id,
          data: [0, 0, 1, 1],
        },
        {
          id: line2Id,
          data: [1, 1, 0, 0],
        },
      ],
    },
    {
      kind: MarkKind.LinePoint,
      position: [120, 120],
      line: line1Id,
      connection: [1, 0, 0, 0],
    },
    {
      kind: MarkKind.LinePoint,
      position: [140, 100],
      line: line2Id,
      connection: [0, 0, 0, 1],
    },
  ]);

  line2.deleteMark();

  deepEqual(sheet.markMap.toData(), [
    {
      kind: MarkKind.LinePoint,
      position: [100, 100],
      line: line1Id,
      connection: [0, 1, 0, 0],
    },
    {
      kind: MarkKind.Line,
      position: [120, 100],
      line: line1Id,
      connection: [0, 0, 1, 1],
    },
    {
      kind: MarkKind.LinePoint,
      position: [120, 120],
      line: line1Id,
      connection: [1, 0, 0, 0],
    },
  ]);
});

test('三条导线构成 H 形状，删除中横导线', ({ deepEqual }) => {
  const sheet = new SheetContext();
  const line1Id = 'line_1';
  const line2Id = 'line_2';
  const line3Id = 'line_3';
  const line4Id = 'line_4';
  const line5Id = 'line_5';
  const line1 = new LineMarker([[100, 100], [100, 120], [100, 140]], sheet);
  const line2 = new LineMarker([[120, 100], [120, 120], [120, 140]], sheet);
  const line3 = new LineMarker([[100, 140], [100, 160]], sheet);
  const line4 = new LineMarker([[120, 140], [120, 160]], sheet);
  const line5 = new LineMarker([[100, 140], [120, 140]], sheet);

  line1.id = line1Id;
  line2.id = line2Id;
  line3.id = line3Id;
  line4.id = line4Id;
  line5.id = line5Id;

  line1.setMark();
  line2.setMark();
  line3.setMark();
  line4.setMark();
  line5.setMark();

  deepEqual(sheet.markMap.toData(), [
    {
      kind: MarkKind.LinePoint,
      line: line1Id,
      position: [100, 100],
      connection: [0, 0, 1, 0],
    },
    {
      kind: MarkKind.Line,
      line: line1Id,
      position: [100, 120],
      connection: [1, 0, 1, 0],
    },
    {
      kind: MarkKind.LineCross,
      lines: [line1Id, line3Id, line5Id],
      position: [100, 140],
      connection: [1, 1, 1, 0],
    },
    {
      kind: MarkKind.LinePoint,
      line: line3Id,
      position: [100, 160],
      connection: [1, 0, 0, 0],
    },
    {
      kind: MarkKind.LinePoint,
      position: [120, 100],
      line: line2Id,
      connection: [0, 0, 1, 0],
    },
    {
      kind: MarkKind.Line,
      position: [120, 120],
      line: line2Id,
      connection: [1, 0, 1, 0],
    },
    {
      kind: MarkKind.LineCross,
      position: [120, 140],
      lines: [line2Id, line4Id, line5Id],
      connection: [1, 0, 1, 1],
    },
    {
      kind: MarkKind.LinePoint,
      position: [120, 160],
      line: line4Id,
      connection: [1, 0, 0, 0],
    },
  ]);

  line5.deleteMark();

  deepEqual(sheet.markMap.toData(), [
    {
      kind: MarkKind.LinePoint,
      line: line1Id,
      position: [100, 100],
      connection: [0, 0, 1, 0],
    },
    {
      kind: MarkKind.Line,
      line: line1Id,
      position: [100, 120],
      connection: [1, 0, 1, 0],
    },
    {
      kind: MarkKind.LineCross,
      lines: [line1Id, line3Id],
      position: [100, 140],
      connection: [1, 0, 1, 0],
    },
    {
      kind: MarkKind.LinePoint,
      line: line3Id,
      position: [100, 160],
      connection: [1, 0, 0, 0],
    },
    {
      kind: MarkKind.LinePoint,
      position: [120, 100],
      line: line2Id,
      connection: [0, 0, 1, 0],
    },
    {
      kind: MarkKind.Line,
      position: [120, 120],
      line: line2Id,
      connection: [1, 0, 1, 0],
    },
    {
      kind: MarkKind.LineCross,
      position: [120, 140],
      lines: [line2Id, line4Id],
      connection: [1, 0, 1, 0],
    },
    {
      kind: MarkKind.LinePoint,
      position: [120, 160],
      line: line4Id,
      connection: [1, 0, 0, 0],
    },
  ]);
});
