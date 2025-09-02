import { Point } from '@circuit/algorithm';
import { createPartByKind, createLineByPath } from '@circuit/electronics';
import { ElectronicKind, PartStructuredData, LineStructuredData } from '@circuit/types';
import { describe, it, expect, beforeEach, beforeAll } from 'vitest';
import {
  MAP_HASH_SERVICE,
  MarkKind,
  IMapHashService,
  LineMark,
  LinePointMark,
  LineCrossMark,
  LineCoverMark,
  PartPinLineMark,
  PartPinMark,
  PartMark,
  LineAndPointMark,
} from '../../src/types';
import { registerPlugin, getPlugin } from '../utils';

describe('图纸标记服务', () => {
  registerPlugin('services/map-hash/register.ts');

  let mapHash: IMapHashService;

  beforeAll(async () => {
    mapHash = await getPlugin(MAP_HASH_SERVICE);
  });

  beforeEach(() => {
    mapHash.clearAll();
  });

  describe('核心服务方法', () => {
    it('has 方法应该正确判断位置是否存在标记', () => {
      const part = createPartByKind(ElectronicKind.Resistance);
      mapHash.setPartMark(part);
      expect(mapHash.has(Point.from([0, 0]))).toBe(true);
      expect(mapHash.has(Point.from([100, 100]))).toBe(false);
    });

    it('get 方法应该正确获取指定位置的标记', () => {
      const part = createPartByKind(ElectronicKind.Resistance);
      mapHash.setPartMark(part);
      const mark = mapHash.get(Point.from([0, 0]));
      expect(mark).toBeDefined();
      expect(mark?.kind).toBe(MarkKind.Part);
      expect((mark as any)?.id).toBe(part.id);
    });

    it('set 方法应该正确设置标记', () => {
      const customMark = {
        kind: MarkKind.Line,
        id: 'custom-line',
        position: Point.from([100, 100]),
        connection: { top: true, bottom: true },
      } as any;
      mapHash.set(customMark);
      expect(mapHash.has(Point.from([100, 100]))).toBe(true);
      expect(mapHash.get(Point.from([100, 100]))).toEqual(customMark);
    });

    it('delete 方法应该正确删除指定位置的标记', () => {
      const part = createPartByKind(ElectronicKind.Resistance);
      mapHash.setPartMark(part);
      expect(mapHash.has(Point.from([0, 0]))).toBe(true);
      mapHash.delete(Point.from([0, 0]));
      expect(mapHash.has(Point.from([0, 0]))).toBe(false);
    });
  });

  describe('业务方法', () => {
    describe('器件标记', () => {
      let part: PartStructuredData;

      beforeEach(async () => {
        part = createPartByKind(ElectronicKind.Resistance);
      });

      it('设置器件标记应该生成正确的标记', () => {
        mapHash.setPartMark(part);
        expect(mapHash.getAllMarks()).toEqual([
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
        expect(mapHash.getAllMarks()).toEqual([]);
      });
    });

    describe('导线标记', () => {
      let line: LineStructuredData;

      beforeEach(async () => {
        line = createLineByPath([
          Point.from([0, 0]),
          Point.from([0, 60]),
          Point.from([60, 60]),
        ]);
      });

      it('设置导线标记应该生成正确的标记', () => {
        mapHash.setLineMark(line);
        expect(mapHash.getAllMarks()).toEqual([
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
        expect(mapHash.getAllMarks()).toEqual([]);
      });
    });

    describe('器件连接导线标记', () => {
      let part: PartStructuredData;
      let line: LineStructuredData;

      beforeEach(async () => {
        part = createPartByKind(ElectronicKind.Resistance);
        line = createLineByPath([
          Point.from([40, 0]),
          Point.from([40, 60]),
          Point.from([60, 60]),
        ]);
      });

      it('器件和导线相连时应该生成 PartPinLine 标记', () => {
        mapHash.setPartMark(part);
        mapHash.setLineMark(line);

        expect(mapHash.getAllMarks()).toEqual([
          { kind: MarkKind.PartPin, id: part.id, pin: 0, position: Point.from([-40, 0]) },
          { kind: MarkKind.Part, id: part.id, position: Point.from([-20, 0]) },
          { kind: MarkKind.Part, id: part.id, position: Point.from([0, 0]) },
          { kind: MarkKind.Part, id: part.id, position: Point.from([20, 0]) },
          {
            kind: MarkKind.PartPinLine,
            id: part.id,
            pin: 1,
            line: line.id,
            position: Point.from([40, 0]),
            connection: { bottom: true },
          },
          {
            kind: MarkKind.Line,
            id: line.id,
            position: Point.from([40, 20]),
            connection: { top: true, bottom: true },
          },
          {
            kind: MarkKind.Line,
            id: line.id,
            position: Point.from([40, 40]),
            connection: { top: true, bottom: true },
          },
          {
            kind: MarkKind.Line,
            id: line.id,
            position: Point.from([40, 60]),
            connection: { top: true, right: true },
          },
          {
            kind: MarkKind.LinePoint,
            id: line.id,
            position: Point.from([60, 60]),
            connection: { left: true },
          },
        ]);
      });

      it('删除导线后器件节点标记应该还原回 PartPin', () => {
        mapHash.setPartMark(part);
        mapHash.setLineMark(line);
        mapHash.deleteLineMark(line);

        expect(mapHash.getAllMarks()).toEqual([
          { kind: MarkKind.PartPin, id: part.id, pin: 0, position: Point.from([-40, 0]) },
          { kind: MarkKind.Part, id: part.id, position: Point.from([-20, 0]) },
          { kind: MarkKind.Part, id: part.id, position: Point.from([0, 0]) },
          { kind: MarkKind.Part, id: part.id, position: Point.from([20, 0]) },
          { kind: MarkKind.PartPin, id: part.id, pin: 1, position: Point.from([40, 0]) },
        ]);
      });

      it('删除器件后导线标记应该还原回 LinePoint', () => {
        mapHash.setPartMark(part);
        mapHash.setLineMark(line);
        mapHash.deletePartMark(part);

        expect(mapHash.getAllMarks()).toEqual([
          {
            kind: MarkKind.LinePoint,
            id: line.id,
            position: Point.from([40, 0]),
            connection: { bottom: true },
          },
          {
            kind: MarkKind.Line,
            id: line.id,
            position: Point.from([40, 20]),
            connection: { top: true, bottom: true },
          },
          {
            kind: MarkKind.Line,
            id: line.id,
            position: Point.from([40, 40]),
            connection: { top: true, bottom: true },
          },
          {
            kind: MarkKind.Line,
            id: line.id,
            position: Point.from([40, 60]),
            connection: { top: true, right: true },
          },
          {
            kind: MarkKind.LinePoint,
            id: line.id,
            position: Point.from([60, 60]),
            connection: { left: true },
          },
        ]);
      });
    });

    describe('两根导线相互连接标记', () => {
      let line1: LineStructuredData;
      let line2: LineStructuredData;

      beforeEach(async () => {
        line1 = createLineByPath([
          Point.from([0, 0]),
          Point.from([0, 40]),
        ]);
        line2 = createLineByPath([
          Point.from([0, 40]),
          Point.from([40, 40]),
        ]);
      });

      it('导线相互连接时应该生成 LineCross 标记', () => {
        mapHash.setLineMark(line1);
        mapHash.setLineMark(line2);

        expect(mapHash.getAllMarks()).toEqual([
          {
            id: line1.id,
            kind: MarkKind.LinePoint,
            position: Point.from([0, 0]),
            connection: {
              bottom: true,
            },
          },
          {
            id: line1.id,
            kind: MarkKind.Line,
            position: Point.from([0, 20]),
            connection: {
              bottom: true,
              top: true,
            },
          },
          {
            kind: MarkKind.LineCross,
            lines: [line1.id, line2.id],
            position: Point.from([0, 40]),
            connection: {
              right: true,
              top: true,
            },
          },
          {
            id: line2.id,
            kind: MarkKind.Line,
            position: Point.from([20, 40]),
            connection: {
              left: true,
              right: true,
            },
          },
          {
            id: line2.id,
            kind: MarkKind.LinePoint,
            position: Point.from([40, 40]),
            connection: {
              left: true,
            },
          },
        ]);
      });

      it('删除某个导线后，剩下的导线标记应该还原为导线节点', () => {
        mapHash.setLineMark(line1);
        mapHash.setLineMark(line2);
        mapHash.deleteLineMark(line2);

        expect(mapHash.getAllMarks()).toEqual([
          {
            id: line1.id,
            kind: MarkKind.LinePoint,
            position: Point.from([0, 0]),
            connection: {
              bottom: true,
            },
          },
          {
            id: line1.id,
            kind: MarkKind.Line,
            position: Point.from([0, 20]),
            connection: {
              bottom: true,
              top: true,
            },
          },
          {
            id: line1.id,
            kind: MarkKind.LinePoint,
            position: Point.from([0, 40]),
            connection: {
              top: true,
            },
          },
        ]);
      });
    });

    describe('三根导线相互连接标记', () => {
      let line1: LineStructuredData;
      let line2: LineStructuredData;
      let line3: LineStructuredData;

      beforeEach(async () => {
        line1 = createLineByPath([
          Point.from([0, 0]),
          Point.from([0, 40]),
        ]);
        line2 = createLineByPath([
          Point.from([0, 40]),
          Point.from([40, 40]),
        ]);
        line3 = createLineByPath([
          Point.from([0, 40]),
          Point.from([0, 80]),
        ]);
      });

      it('导线相互连接时应该生成 LineCross 标记', () => {
        mapHash.setLineMark(line1);
        mapHash.setLineMark(line2);
        mapHash.setLineMark(line3);

        expect(mapHash.getAllMarks()).toEqual([
          {
            id: line1.id,
            kind: MarkKind.LinePoint,
            position: Point.from([0, 0]),
            connection: {
              bottom: true,
            },
          },
          {
            id: line1.id,
            kind: MarkKind.Line,
            position: Point.from([0, 20]),
            connection: {
              bottom: true,
              top: true,
            },
          },
          {
            kind: MarkKind.LineCross,
            lines: [
              line1.id, line2.id, line3.id,
            ],
            position: Point.from([0, 40]),
            connection: {
              right: true,
              top: true,
              bottom: true,
            },
          },
          {
            id: line3.id,
            kind: MarkKind.Line,
            position: Point.from([0, 60]),
            connection: {
              top: true,
              bottom: true,
            },
          },
          {
            id: line3.id,
            kind: MarkKind.LinePoint,
            position: Point.from([0, 80]),
            connection: {
              top: true,
            },
          },
          {
            id: line2.id,
            kind: MarkKind.Line,
            position: Point.from([20, 40]),
            connection: {
              left: true,
              right: true,
            },
          },
          {
            id: line2.id,
            kind: MarkKind.LinePoint,
            position: Point.from([40, 40]),
            connection: {
              left: true,
            },
          },
        ]);
      });

      it('删除某个导线后，剩下的导线标记应该保持不变', () => {
        mapHash.setLineMark(line1);
        mapHash.setLineMark(line2);
        mapHash.setLineMark(line3);
        mapHash.deleteLineMark(line3);

        expect(mapHash.getAllMarks()).toEqual([
          {
            id: line1.id,
            kind: MarkKind.LinePoint,
            position: Point.from([0, 0]),
            connection: {
              bottom: true,
            },
          },
          {
            id: line1.id,
            kind: MarkKind.Line,
            position: Point.from([0, 20]),
            connection: {
              bottom: true,
              top: true,
            },
          },
          {
            kind: MarkKind.LineCross,
            lines: [line1.id, line2.id],
            position: Point.from([0, 40]),
            connection: {
              right: true,
              top: true,
            },
          },
          {
            id: line2.id,
            kind: MarkKind.Line,
            position: Point.from([20, 40]),
            connection: {
              left: true,
              right: true,
            },
          },
          {
            id: line2.id,
            kind: MarkKind.LinePoint,
            position: Point.from([40, 40]),
            connection: {
              left: true,
            },
          },
        ]);
      });
    });

    describe('导线相互覆盖，生成交叠节点标记', () => {
      let line1: LineStructuredData;
      let line2: LineStructuredData;

      beforeEach(async () => {
        line1 = createLineByPath([
          Point.from([0, 0]),
          Point.from([0, 40]),
        ]);
        line2 = createLineByPath([
          Point.from([-20, 20]),
          Point.from([20, 20]),
        ]);
      });

      it('导线相互覆盖时应该生成 LineCover 标记', () => {
        mapHash.setLineMark(line1);
        mapHash.setLineMark(line2);

        expect(mapHash.getAllMarks()).toEqual([
          {
            id: line2.id,
            kind: MarkKind.LinePoint,
            position: Point.from([-20, 20]),
            connection: {
              right: true,
            },
          },
          {
            id: line1.id,
            kind: MarkKind.LinePoint,
            position: Point.from([0, 0]),
            connection: {
              bottom: true,
            },
          },
          {
            kind: MarkKind.LineCover,
            lines: [line1.id, line2.id],
            position: Point.from([0, 20]),
            connections: {
              [line1.id]: {
                top: true,
                bottom: true,
              },
              [line2.id]: {
                left: true,
                right: true,
              },
            },
          },
          {
            id: line1.id,
            kind: MarkKind.LinePoint,
            position: Point.from([0, 40]),
            connection: {
              top: true,
            },
          },
          {
            id: line2.id,
            kind: MarkKind.LinePoint,
            position: Point.from([20, 20]),
            connection: {
              left: true,
            },
          },
        ]);
      });

      it('删除某个导线后，剩下的导线标记应该恢复为导线节点', () => {
        mapHash.setLineMark(line1);
        mapHash.setLineMark(line2);
        mapHash.deleteLineMark(line2);

        expect(mapHash.getAllMarks()).toEqual([
          {
            id: line1.id,
            kind: MarkKind.LinePoint,
            position: Point.from([0, 0]),
            connection: {
              bottom: true,
            },
          },
          {
            id: line1.id,
            kind: MarkKind.Line,
            position: Point.from([0, 20]),
            connection: {
              bottom: true,
              top: true,
            },
          },
          {
            id: line1.id,
            kind: MarkKind.LinePoint,
            position: Point.from([0, 40]),
            connection: {
              top: true,
            },
          },
        ]);
      });
    });
  });

  describe('断言服务方法', () => {
    it('isLine 方法应该正确识别导线标记', () => {
      const nonLine = { kind: 'not-a-line' } as any;
      expect(mapHash.isLine(nonLine)).toBe(false);

      const line: LineMark = {
        kind: MarkKind.Line,
        id: 'line-id',
        position: Point.from([0, 0]),
        connection: {},
      };
      expect(mapHash.isLine(line)).toBe(true);
    });

    it('isLinePoint 方法应该正确识别导线节点标记', () => {
      const nonLine = { kind: 'not-a-line' } as any;
      expect(mapHash.isLine(nonLine)).toBe(false);

      const line: LinePointMark = {
        kind: MarkKind.LinePoint,
        id: 'line-id',
        position: Point.from([0, 0]),
        connection: {},
      };
      expect(mapHash.isLinePoint(line)).toBe(true);
    });

    it('isLineCross 方法应该正确识别交错节点标记', () => {
      const nonLineCross = { kind: 'not-a-line-cross' } as any;
      expect(mapHash.isLineCross(nonLineCross)).toBe(false);

      const lineCross: LineCrossMark = {
        kind: MarkKind.LineCross,
        lines: ['line1', 'line2'],
        position: Point.from([0, 0]),
        connection: {},
      };
      expect(mapHash.isLineCross(lineCross)).toBe(true);
    });

    it('isLineCover 方法应该正确识别交叠节点标记', () => {
      const nonLineCover = { kind: 'not-a-line-cover' } as any;
      expect(mapHash.isLineCover(nonLineCover)).toBe(false);

      const lineCover: LineCoverMark = {
        kind: MarkKind.LineCover,
        lines: ['line1', 'line2'],
        position: Point.from([0, 0]),
        connections: {
          line1: { top: true, bottom: true },
          line2: { left: true, right: true },
        },
      };
      expect(mapHash.isLineCover(lineCover)).toBe(true);
    });

    it('isPart 方法应该正确识别器件标记', () => {
      const nonPart = { kind: 'not-a-part' } as any;
      expect(mapHash.isPart(nonPart)).toBe(false);

      const part: PartMark = {
        kind: MarkKind.Part,
        id: 'part-id',
        position: Point.from([0, 0]),
      };
      expect(mapHash.isPart(part)).toBe(true);
    });

    it('isPartPin 方法应该正确识别器件空引脚标记', () => {
      const nonPartPin = { kind: 'not-a-part-pin' } as any;
      expect(mapHash.isPartPin(nonPartPin)).toBe(false);

      const partPin: PartPinMark = {
        kind: MarkKind.PartPin,
        id: 'part-id',
        pin: 0,
        position: Point.from([0, 0]),
      };
      expect(mapHash.isPartPin(partPin)).toBe(true);
    });

    it('isPartPinLine 方法应该正确识别器件引脚节点连接导线标记', () => {
      const nonPartPinLine = { kind: 'not-a-part-pin-line' } as any;
      expect(mapHash.isPartPinLine(nonPartPinLine)).toBe(false);

      const partPinLine: PartPinLineMark = {
        kind: MarkKind.PartPinLine,
        id: 'part-id',
        pin: 0,
        line: 'line-id',
        position: Point.from([0, 0]),
        connection: {},
      };
      expect(mapHash.isPartPinLine(partPinLine)).toBe(true);
    });

    it('isLineAndPoint 方法应该正确识别导线节点类型', () => {
      const nonLineAndPoint = { kind: 'not-a-line-and-point' } as any;
      expect(mapHash.isLineAndPoint(nonLineAndPoint)).toBe(false);

      // 测试各种导线节点类型
      const line: LineMark = {
        kind: MarkKind.Line,
        id: 'line-id',
        position: Point.from([0, 0]),
        connection: {},
      };
      expect(mapHash.isLineAndPoint(line)).toBe(true);

      const linePoint: LinePointMark = {
        kind: MarkKind.LinePoint,
        id: 'line-id',
        position: Point.from([0, 0]),
        connection: {},
      };
      expect(mapHash.isLineAndPoint(linePoint)).toBe(true);

      const lineCross: LineCrossMark = {
        kind: MarkKind.LineCross,
        lines: ['line1', 'line2'],
        position: Point.from([0, 0]),
        connection: {},
      };
      expect(mapHash.isLineAndPoint(lineCross)).toBe(true);

      const lineCover: LineCoverMark = {
        kind: MarkKind.LineCover,
        lines: ['line1', 'line2'],
        position: Point.from([0, 0]),
        connections: {
          line1: { top: true, bottom: true },
          line2: { left: true, right: true },
        },
      };
      expect(mapHash.isLineAndPoint(lineCover)).toBe(true);

      const partPinLine: PartPinLineMark = {
        kind: MarkKind.PartPinLine,
        id: 'part-id',
        pin: 0,
        line: 'line-id',
        position: Point.from([0, 0]),
        connection: {},
      };
      expect(mapHash.isLineAndPoint(partPinLine)).toBe(true);
    });

    it('isPartAndPin 方法应该正确识别器件节点类型', () => {
      const nonPartAndPin = { kind: 'not-a-part-and-pin' } as any;
      expect(mapHash.isPartAndPin(nonPartAndPin)).toBe(false);

      // 测试器件节点类型
      const part: PartMark = {
        kind: MarkKind.Part,
        id: 'part-id',
        position: Point.from([0, 0]),
      };
      expect(mapHash.isPartAndPin(part)).toBe(true);

      const partPin: PartPinMark = {
        kind: MarkKind.PartPin,
        id: 'part-id',
        pin: 0,
        position: Point.from([0, 0]),
      };
      expect(mapHash.isPartAndPin(partPin)).toBe(true);
    });
  });

  describe('标记数据服务方法', () => {
    describe('hasLine 方法', () => {
      it('单导线节点', () => {
        const line = createLineByPath([
          Point.from([0, 0]),
          Point.from([0, 40]),
        ]);
        mapHash.setLineMark(line);
        const mark = mapHash.get(Point.from([0, 20]));
        expect(mapHash.hasLine(mark as any, line.id)).toBe(true);
        expect(mapHash.hasLine(mark as any, 'non-existent-line')).toBe(false);
      });

      it('交错节点', () => {
        const line1 = createLineByPath([
          Point.from([0, 0]),
          Point.from([0, 40]),
        ]);
        const line2 = createLineByPath([
          Point.from([0, 40]),
          Point.from([40, 40]),
        ]);
        mapHash.setLineMark(line1);
        mapHash.setLineMark(line2);

        const mark1 = mapHash.get(Point.from([0, 40])) as LineCrossMark;
        const mark2 = mapHash.get(Point.from([0, 20])) as LineMark;
        const mark3 = mapHash.get(Point.from([20, 40])) as LineMark;

        expect(mapHash.hasLine(mark1, line1.id)).toBe(true);
        expect(mapHash.hasLine(mark1, line2.id)).toBe(true);
        expect(mapHash.hasLine(mark1, 'non-existent-line')).toBe(false);

        expect(mapHash.hasLine(mark2, line1.id)).toBe(true);
        expect(mapHash.hasLine(mark2, line2.id)).toBe(false);
        expect(mapHash.hasLine(mark2, 'non-existent-line')).toBe(false);

        expect(mapHash.hasLine(mark3, line1.id)).toBe(false);
        expect(mapHash.hasLine(mark3, line2.id)).toBe(true);
        expect(mapHash.hasLine(mark3, 'non-existent-line')).toBe(false);
      });

      it('交叠节点', () => {
        const line1 = createLineByPath([
          Point.from([0, 0]),
          Point.from([0, 40]),
        ]);
        const line2 = createLineByPath([
          Point.from([-20, 20]),
          Point.from([20, 20]),
        ]);

        mapHash.setLineMark(line1);
        mapHash.setLineMark(line2);

        const mark1 = mapHash.get(Point.from([0, 20])) as LineCoverMark;
        const mark2 = mapHash.get(Point.from([0, 40])) as LinePointMark;
        const mark3 = mapHash.get(Point.from([20, 20])) as LinePointMark;

        expect(mapHash.hasLine(mark1, line1.id)).toBe(true);
        expect(mapHash.hasLine(mark1, line2.id)).toBe(true);
        expect(mapHash.hasLine(mark1, 'non-existent-line')).toBe(false);

        expect(mapHash.hasLine(mark2, line1.id)).toBe(true);
        expect(mapHash.hasLine(mark2, line2.id)).toBe(false);
        expect(mapHash.hasLine(mark2, 'non-existent-line')).toBe(false);

        expect(mapHash.hasLine(mark3, line1.id)).toBe(false);
        expect(mapHash.hasLine(mark3, line2.id)).toBe(true);
        expect(mapHash.hasLine(mark3, 'non-existent-line')).toBe(false);
      });
    });

    describe('hasConnect 方法', () => {
      it('单导线节点', () => {
        const line = createLineByPath([
          Point.from([0, 0]),
          Point.from([0, 40]),
        ]);

        mapHash.setLineMark(line);

        const node1 = Point.from([0, 0]);
        const node2 = Point.from([0, 20]);
        const node3 = Point.from([0, 40]);

        const mark1 = mapHash.get(node1) as LineAndPointMark;
        const mark2 = mapHash.get(node2) as LineAndPointMark;
        const mark3 = mapHash.get(node3) as LineAndPointMark;

        expect(mapHash.hasConnect(mark1, node1)).toBe(false);
        expect(mapHash.hasConnect(mark1, node2)).toBe(true);
        expect(mapHash.hasConnect(mark1, node3)).toBe(false);

        expect(mapHash.hasConnect(mark2, node1)).toBe(true);
        expect(mapHash.hasConnect(mark2, node2)).toBe(false);
        expect(mapHash.hasConnect(mark2, node3)).toBe(true);

        expect(mapHash.hasConnect(mark3, node1)).toBe(false);
        expect(mapHash.hasConnect(mark3, node2)).toBe(true);
        expect(mapHash.hasConnect(mark3, node3)).toBe(false);
      });

      it('交错节点', () => {
        const line1 = createLineByPath([
          Point.from([0, 0]),
          Point.from([0, 40]),
        ]);
        const line2 = createLineByPath([
          Point.from([0, 40]),
          Point.from([40, 40]),
        ]);

        mapHash.setLineMark(line1);
        mapHash.setLineMark(line2);

        const mark1 = mapHash.get(Point.from([0, 40])) as LineCrossMark;
        const node1 = Point.from([0, 0]);
        const node2 = Point.from([0, 20]);
        const node3 = Point.from([20, 40]);
        const node4 = Point.from([40, 40]);

        expect(mapHash.hasConnect(mark1, node1)).toBe(false);
        expect(mapHash.hasConnect(mark1, node2)).toBe(true);
        expect(mapHash.hasConnect(mark1, node3)).toBe(true);
        expect(mapHash.hasConnect(mark1, node4)).toBe(false);
      });

      it('交叠节点', () => {
        const line1 = createLineByPath([
          Point.from([0, 0]),
          Point.from([0, 40]),
        ]);
        const line2 = createLineByPath([
          Point.from([-20, 20]),
          Point.from([20, 20]),
        ]);

        mapHash.setLineMark(line1);
        mapHash.setLineMark(line2);

        const mark1 = mapHash.get(Point.from([0, 20])) as LineCoverMark;
        const node1 = Point.from([0, 0]);
        const node2 = Point.from([0, 40]);
        const node3 = Point.from([-20, 20]);
        const node4 = Point.from([20, 20]);

        expect(mapHash.hasConnect(mark1, node1)).toBe(true);
        expect(mapHash.hasConnect(mark1, node2)).toBe(true);
        expect(mapHash.hasConnect(mark1, node3)).toBe(true);
        expect(mapHash.hasConnect(mark1, node4)).toBe(true);
      });
    });

    describe('isFullCross 方法', () => {
      let line: LineStructuredData;

      beforeEach(() => {
        mapHash.setLineMark(createLineByPath([
          Point.from([0, 40]),
          Point.from([0, 0]),
        ]));
        mapHash.setLineMark(createLineByPath([
          Point.from([0, 40]),
          Point.from([0, 80]),
        ]));
        mapHash.setLineMark(createLineByPath([
          Point.from([0, 40]),
          Point.from([40, 40]),
        ]));
        line = createLineByPath([
          Point.from([0, 40]),
          Point.from([-40, 40]),
        ]);
        mapHash.setLineMark(line);
      });

      it('全交叉节点', () => {
        const mark = mapHash.get(Point.from([0, 40])) as LineCrossMark;
        expect(mapHash.isFullCross(mark)).toBe(true);
      });

      it('删除某个导线后，节点变成非全交叉节点', () => {
        mapHash.deleteLineMark(line);
        const mark = mapHash.get(Point.from([0, 40])) as LineCrossMark;
        expect(mapHash.isFullCross(mark)).toBe(false);
      });
    });

    describe('inStraightLine 方法', () => {
      it('十字交叠节点前后连通', () => {
        const line1 = createLineByPath([
          Point.from([0, 0]),
          Point.from([0, 40]),
        ]);
        const line2 = createLineByPath([
          Point.from([-20, 20]),
          Point.from([20, 20]),
        ]);

        mapHash.setLineMark(line1);
        mapHash.setLineMark(line2);

        const coverMark = mapHash.get(Point.from([0, 20])) as LineCoverMark;
        const node1 = Point.from([0, 0]);
        const node2 = Point.from([0, 40]);
        const node3 = Point.from([-20, 20]);
        const node4 = Point.from([20, 20]);

        expect(mapHash.inStraightLine(coverMark, node1, node2)).toBe(true);
        expect(mapHash.inStraightLine(coverMark, node3, node4)).toBe(true);
        expect(mapHash.inStraightLine(coverMark, node1, node3)).toBe(false);
        expect(mapHash.inStraightLine(coverMark, node2, node4)).toBe(false);
      });
      it('直角交叠节点直角连通', () => {
        const line1 = createLineByPath([
          Point.from([0, 0]),
          Point.from([0, 20]),
          Point.from([20, 20]),
        ]);
        const line2 = createLineByPath([
          Point.from([-20, 20]),
          Point.from([0, 20]),
          Point.from([0, 40]),
        ]);

        mapHash.setLineMark(line1);
        mapHash.setLineMark(line2);

        const coverMark = mapHash.get(Point.from([0, 20])) as LineCoverMark;
        const node1 = Point.from([0, 0]);
        const node2 = Point.from([0, 40]);
        const node3 = Point.from([-20, 20]);
        const node4 = Point.from([20, 20]);

        expect(mapHash.inStraightLine(coverMark, node1, node4)).toBe(true);
        expect(mapHash.inStraightLine(coverMark, node2, node3)).toBe(true);
        expect(mapHash.inStraightLine(coverMark, node1, node3)).toBe(false);
        expect(mapHash.inStraightLine(coverMark, node2, node4)).toBe(false);
      });
    });

    describe('alongLineAndVector 方法', () => {
      describe('单直导线节点前进', () => {
        beforeEach(() => {
          mapHash.setLineMark(createLineByPath([
            Point.from([0, 0]),
            Point.from([0, 100]),
          ]));
        });
        it('前进方向为导线方向时，前进到导线终点', () => {
          const mark = mapHash.get(Point.from([0, 20])) as LineAndPointMark;
          const vector = Point.from([0, 1]);
          const end = mapHash.alongLineAndVector(mark, vector);
          expect(end.position).toStrictEqual(Point.from([0, 100]));
        });
        it('前进方向为导线反方向时，前进到导线起点', () => {
          const mark = mapHash.get(Point.from([0, 20])) as LineAndPointMark;
          const vector = Point.from([0, -1]);
          const end = mapHash.alongLineAndVector(mark, vector);
          expect(end.position).toStrictEqual(Point.from([0, 0]));
        });
        it('前进方向不是导线反方向时，结果为起点本身', () => {
          const mark = mapHash.get(Point.from([0, 20])) as LineAndPointMark;
          const vector = Point.from([1, 0]);
          const end = mapHash.alongLineAndVector(mark, vector);
          expect(end.position).toStrictEqual(Point.from([0, 20]));
        });
        it('前进方向为导线方向时，并输入终点时，结果为输入终点', () => {
          const mark = mapHash.get(Point.from([0, 20])) as LineAndPointMark;
          const inputEnd = Point.from([0, 80]);
          const vector = Point.from([0, 1]);
          const end = mapHash.alongLineAndVector(mark, vector, inputEnd);
          expect(end.position).toStrictEqual(inputEnd);
        });
      });

      it('单直角导线，终点是导线拐点', () => {
        mapHash.setLineMark(createLineByPath([
          Point.from([0, 0]),
          Point.from([0, 120]),
          Point.from([100, 120]),
        ]));

        const mark = mapHash.get(Point.from([0, 20])) as LineAndPointMark;
        const vector = Point.from([0, 1]);
        const end = mapHash.alongLineAndVector(mark, vector);
        expect(end.position).toStrictEqual(Point.from([0, 120]));
      });

      it('导线含有交错节点时，终点将会经过交错节点', () => {
        mapHash.setLineMark(createLineByPath([
          Point.from([0, 0]),
          Point.from([0, 60]),
        ]));
        mapHash.setLineMark(createLineByPath([
          Point.from([0, 60]),
          Point.from([0, 120]),
        ]));
        mapHash.setLineMark(createLineByPath([
          Point.from([0, 60]),
          Point.from([60, 60]),
        ]));

        const mark = mapHash.get(Point.from([0, 20])) as LineAndPointMark;
        const vector = Point.from([0, 1]);
        const end = mapHash.alongLineAndVector(mark, vector);
        expect(end.position).toStrictEqual(Point.from([0, 120]));
      });

      describe('导线含有交叠节点时', () => {
        it('含有十字交叠节点时，终点将会经过交叠节点', () => {
          mapHash.setLineMark(createLineByPath([
            Point.from([0, 0]),
            Point.from([0, 120]),
          ]));
          mapHash.setLineMark(createLineByPath([
            Point.from([-40, 60]),
            Point.from([40, 60]),
          ]));

          const mark = mapHash.get(Point.from([0, 20])) as LineAndPointMark;
          const vector = Point.from([0, 1]);
          const end = mapHash.alongLineAndVector(mark, vector);
          expect(end.position).toStrictEqual(Point.from([0, 120]));
        });

        it('含有直角交叠节点时，终点将会停在交叠节点', () => {
          mapHash.setLineMark(createLineByPath([
            Point.from([-40, 60]),
            Point.from([0, 60]),
            Point.from([0, 0]),
          ]));
          mapHash.setLineMark(createLineByPath([
            Point.from([0, 120]),
            Point.from([0, 60]),
            Point.from([40, 60]),
          ]));

          const mark = mapHash.get(Point.from([0, 20])) as LineAndPointMark;
          const vector = Point.from([0, 1]);
          const end = mapHash.alongLineAndVector(mark, vector);
          expect(end.position).toStrictEqual(Point.from([0, 60]));
        });
      });
    });
  });
});
