import { Point, Direction, RotateMatrixSet, Rotate } from '@circuit/algorithm';
import { PartStructuredData, LineStructuredData, ElectronicKind } from '@circuit/types';
import { describe, it, expect } from 'vitest';
import { Map } from '../../src/plugins/services/map-hash';
import { MAP_HASH_SERVICE, MarkKind } from '../../src/types';
import { registerPlugin, getPlugin } from '../utils';

describe('图纸标记服务', () => {
  registerPlugin('services/map-hash/register.ts');

  it('标记器件', async () => {
    const mapHash = await getPlugin(MAP_HASH_SERVICE);
    const part: PartStructuredData = {
      id: 'R_1',
      kind: ElectronicKind.Resistance,
      position: Point.from(0),
      textDirection: Direction.Top,
      propertyValues: [],
      rotate: RotateMatrixSet[Rotate.Same],
    };

    mapHash.setPartMark(part);
    expect(Map.values(mapHash.getMap())).toEqual([
      { kind: MarkKind.PartPin, id: 'R_1', pin: 0, position: Point.from([-40, 0]) },
      { kind: MarkKind.Part, id: 'R_1', position: Point.from([-20, 0]) },
      { kind: MarkKind.Part, id: 'R_1', position: Point.from([0, 0]) },
      { kind: MarkKind.Part, id: 'R_1', position: Point.from([20, 0]) },
      { kind: MarkKind.PartPin, id: 'R_1', pin: 1, position: Point.from([40, 0]) },
    ]);

    mapHash.deletePartMark(part);
    expect(Map.values(mapHash.getMap())).toEqual([]);
  });

  it('标记导线', async () => {
    const mapHash = await getPlugin(MAP_HASH_SERVICE);
    const line: LineStructuredData = {
      id: 'L_1',
      path: [
        Point.from([0, 0]),
        Point.from([0, 60]),
        Point.from([60, 60]),
      ],
    };

    mapHash.setLineMark(line);
    expect(Map.values(mapHash.getMap())).toEqual([
      {
        kind: 1,
        id: 'L_1',
        position: Point.from([0, 0]),
        connection: { bottom: true },
      },
      {
        kind: 0,
        id: 'L_1',
        position: Point.from([0, 20]),
        connection: { top: true, bottom: true },
      },
      {
        kind: 0,
        id: 'L_1',
        position: Point.from([0, 40]),
        connection: { top: true, bottom: true },
      },
      {
        kind: 0,
        id: 'L_1',
        position: Point.from([0, 60]),
        connection: { top: true, right: true },
      },
      {
        kind: 0,
        id: 'L_1',
        position: Point.from([20, 60]),
        connection: { left: true, right: true },
      },
      {
        kind: 0,
        id: 'L_1',
        position: Point.from([40, 60]),
        connection: { left: true, right: true },
      },
      {
        kind: 1,
        id: 'L_1',
        position: Point.from([60, 60]),
        connection: { left: true },
      },
    ]);

    mapHash.deleteLineMark(line);
    expect(Map.values(mapHash.getMap())).toEqual([]);
  });

  it('标记器件+导线，然后删除导线', async () => {
    const mapHash = await getPlugin(MAP_HASH_SERVICE);
    const part: PartStructuredData = {
      id: 'R_1',
      kind: ElectronicKind.Resistance,
      position: Point.from(0),
      textDirection: Direction.Top,
      propertyValues: [],
      rotate: RotateMatrixSet[Rotate.Same],
    };
    const line: LineStructuredData = {
      id: 'L_1',
      path: [
        Point.from([40, 0]),
        Point.from([40, 60]),
        Point.from([60, 60]),
      ],
    };

    mapHash.setPartMark(part);
    mapHash.setLineMark(line);

    expect(Map.values(mapHash.getMap())).toEqual([
      { kind: MarkKind.PartPin, id: 'R_1', pin: 0, position: Point.from([-40, 0]) },
      { kind: MarkKind.Part, id: 'R_1', position: Point.from([-20, 0]) },
      { kind: MarkKind.Part, id: 'R_1', position: Point.from([0, 0]) },
      { kind: MarkKind.Part, id: 'R_1', position: Point.from([20, 0]) },
      {
        kind: MarkKind.PartPinLine,
        id: 'R_1',
        pin: 1,
        line: 'L_1',
        position: Point.from([40, 0]),
        connection: { bottom: true },
      },
      {
        kind: MarkKind.Line,
        id: 'L_1',
        position: Point.from([40, 20]),
        connection: { top: true, bottom: true },
      },
      {
        kind: MarkKind.Line,
        id: 'L_1',
        position: Point.from([40, 40]),
        connection: { top: true, bottom: true },
      },
      {
        kind: MarkKind.Line,
        id: 'L_1',
        position: Point.from([40, 60]),
        connection: { top: true, right: true },
      },
      {
        kind: MarkKind.LinePoint,
        id: 'L_1',
        position: Point.from([60, 60]),
        connection: { left: true },
      },
    ]);

    mapHash.deleteLineMark(line);
    expect(Map.values(mapHash.getMap())).toEqual([
      { kind: MarkKind.PartPin, id: 'R_1', pin: 0, position: Point.from([-40, 0]) },
      { kind: MarkKind.Part, id: 'R_1', position: Point.from([-20, 0]) },
      { kind: MarkKind.Part, id: 'R_1', position: Point.from([0, 0]) },
      { kind: MarkKind.Part, id: 'R_1', position: Point.from([20, 0]) },
      { kind: MarkKind.PartPin, id: 'R_1', pin: 1, position: Point.from([40, 0]) },
    ]);
  });
});
