import { Point } from '@circuit/algorithm';
import { createPartByKind, createLineByPath } from '@circuit/electronics';
import { ElectronicKind, PartStructuredData, LineStructuredData } from '@circuit/types';
import { describe, it, expect, beforeEach } from 'vitest';
import { Map } from '../../src/plugins/services/map-hash';
import { MAP_HASH_SERVICE, MarkKind, IMapService } from '../../src/types';
import { registerPlugin, getPlugin } from '../utils';

describe('图纸标记服务', () => {
  registerPlugin('services/map-hash/register.ts');

  let mapHash: IMapService;
  let part: PartStructuredData;
  let line: LineStructuredData;

  beforeEach(async () => {
    mapHash = await getPlugin(MAP_HASH_SERVICE);
    part = createPartByKind(ElectronicKind.Resistance, []);
    line = createLineByPath([
      Point.from([0, 0]),
      Point.from([0, 60]),
      Point.from([60, 60]),
    ]);
  });

  describe('器件标记', () => {
    it('设置器件标记应该生成正确的标记', () => {
      mapHash.setPartMark(part);
      expect(Map.values(mapHash.getMap())).toEqual([
        { kind: MarkKind.PartPin, id: part.id, pin: 0, position: Point.from([-40, 0]) },
        { kind: MarkKind.Part, id: part.id, position: Point.from([-20, 0]) },
        { kind: MarkKind.Part, id: part.id, position: Point.from([0, 0]) },
        { kind: MarkKind.Part, id: part.id, position: Point.from([20, 0]) },
        { kind: MarkKind.PartPin, id: part.id, pin: 1, position: Point.from([40, 0]) },
      ]);
    });

    it('删除器件标记应该清空相关标记', () => {
      mapHash.setPartMark(part);
      mapHash.deletePartMark(part);
      expect(Map.values(mapHash.getMap())).toEqual([]);
    });
  });

  describe('导线标记', () => {
    it('设置导线标记应该生成正确的标记', () => {
      mapHash.setLineMark(line);
      expect(Map.values(mapHash.getMap())).toEqual([
        {
          kind: 1,
          id: line.id,
          position: Point.from([0, 0]),
          connection: { bottom: true },
        },
        {
          kind: 0,
          id: line.id,
          position: Point.from([0, 20]),
          connection: { top: true, bottom: true },
        },
        {
          kind: 0,
          id: line.id,
          position: Point.from([0, 40]),
          connection: { top: true, bottom: true },
        },
        {
          kind: 0,
          id: line.id,
          position: Point.from([0, 60]),
          connection: { top: true, right: true },
        },
        {
          kind: 0,
          id: line.id,
          position: Point.from([20, 60]),
          connection: { left: true, right: true },
        },
        {
          kind: 0,
          id: line.id,
          position: Point.from([40, 60]),
          connection: { left: true, right: true },
        },
        {
          kind: 1,
          id: line.id,
          position: Point.from([60, 60]),
          connection: { left: true },
        },
      ]);
    });

    it('删除导线标记应该清空相关标记', () => {
      mapHash.setLineMark(line);
      mapHash.deleteLineMark(line);
      expect(Map.values(mapHash.getMap())).toEqual([]);
    });
  });

  describe('复合标记', () => {
    it('器件和导线共存时应该生成复合标记', () => {
      const testLine = createLineByPath([
        Point.from([40, 0]),
        Point.from([40, 60]),
        Point.from([60, 60]),
      ]);

      mapHash.setPartMark(part);
      mapHash.setLineMark(testLine);

      expect(Map.values(mapHash.getMap())).toEqual([
        { kind: MarkKind.PartPin, id: part.id, pin: 0, position: Point.from([-40, 0]) },
        { kind: MarkKind.Part, id: part.id, position: Point.from([-20, 0]) },
        { kind: MarkKind.Part, id: part.id, position: Point.from([0, 0]) },
        { kind: MarkKind.Part, id: part.id, position: Point.from([20, 0]) },
        {
          kind: MarkKind.PartPinLine,
          id: part.id,
          pin: 1,
          line: testLine.id,
          position: Point.from([40, 0]),
          connection: { bottom: true },
        },
        {
          kind: MarkKind.Line,
          id: testLine.id,
          position: Point.from([40, 20]),
          connection: { top: true, bottom: true },
        },
        {
          kind: MarkKind.Line,
          id: testLine.id,
          position: Point.from([40, 40]),
          connection: { top: true, bottom: true },
        },
        {
          kind: MarkKind.Line,
          id: testLine.id,
          position: Point.from([40, 60]),
          connection: { top: true, right: true },
        },
        {
          kind: MarkKind.LinePoint,
          id: testLine.id,
          position: Point.from([60, 60]),
          connection: { left: true },
        },
      ]);
    });

    it('删除导线后器件标记应该保持不变', () => {
      const testLine = createLineByPath([
        Point.from([40, 0]),
        Point.from([40, 60]),
        Point.from([60, 60]),
      ]);

      mapHash.setPartMark(part);
      mapHash.setLineMark(testLine);
      mapHash.deleteLineMark(testLine);

      expect(Map.values(mapHash.getMap())).toEqual([
        { kind: MarkKind.PartPin, id: part.id, pin: 0, position: Point.from([-40, 0]) },
        { kind: MarkKind.Part, id: part.id, position: Point.from([-20, 0]) },
        { kind: MarkKind.Part, id: part.id, position: Point.from([0, 0]) },
        { kind: MarkKind.Part, id: part.id, position: Point.from([20, 0]) },
        { kind: MarkKind.PartPin, id: part.id, pin: 1, position: Point.from([40, 0]) },
      ]);
    });
  });
});
