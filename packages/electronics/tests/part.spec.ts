import {
  Point,
  RotateMatrixSet,
  Rotate,
  Direction,
} from '@circuit/algorithm';
import {
  type PartStoreData,
  type PartStructuredData,
  type LineOrPartStructuredData,
  ElectronicKind,
  ElectronicCategory,
} from '@circuit/types';
import { describe, it, expect } from 'vitest';

import {
  isPart,
  isPartId,
  joinPartReferenceTag,
  createPartReferenceTag,
  parsePartReferenceTag,
  getPartPrototype,
  getPartInfo,
  transformPartStoreToStructureData,
  transformPartStructureToStoreData,
  getPartPin,
  createPartByKind,
  createPartsByKind,
} from '../src/part';

describe('器件相关函数', () => {
  describe('isPart()', () => {
    it('有效的器件应该返回true', () => {
      const part: PartStructuredData = {
        id: '_$part_test123',
        kind: ElectronicKind.Resistance,
        referenceTag: '1',
        position: new Point(0, 0),
        rotate: [[1, 0], [0, 1]],
        propertyValues: [],
        textDirection: 0,
      };

      expect(isPart(part)).toBe(true);
    });

    it('导线应该返回false', () => {
      const line: LineOrPartStructuredData = {
        id: '_$line_test123',
        path: [new Point(0, 0)],
      };

      expect(isPart(line)).toBe(false);
    });
  });

  describe('isPartId()', () => {
    it('有效的器件ID应该返回true', () => {
      expect(isPartId('_$part_abc123')).toBe(true);
      expect(isPartId('_$Part_xyz789')).toBe(true);
    });

    it('无效的器件ID应该返回false', () => {
      expect(isPartId('_$line_abc123')).toBe(false);
      expect(isPartId('part_abc123')).toBe(false);
      expect(isPartId('_$part')).toBe(false);
      expect(isPartId('')).toBe(false);
    });
  });

  describe('引用编号相关函数', () => {
    it('应该正确拼接引用编号', () => {
      expect(joinPartReferenceTag('R', '1')).toBe('R_1');
      expect(joinPartReferenceTag('C', '2')).toBe('C_2');
    });
    it('应该正确创建器件引用编号', () => {
      const part: PartStructuredData = {
        id: '_$part_test123',
        kind: ElectronicKind.Resistance,
        referenceTag: '1',
        position: new Point(0, 0),
        rotate: [[1, 0], [0, 1]],
        propertyValues: [],
        textDirection: 0,
      };

      const result = createPartReferenceTag(part);
      expect(result).toBe('R_1');
    });
    it('应该正确解析引用编号', () => {
      expect(parsePartReferenceTag('R_1')).toEqual(['R', '1']);
      expect(parsePartReferenceTag('C_2')).toEqual(['C', '2']);
      expect(parsePartReferenceTag('U_1_2')).toEqual(['U', '1_2']);
    });
  });

  describe('getPartPrototype()', () => {
    it('应该正确获取器件原型', () => {
      const prototype = getPartPrototype(ElectronicKind.Resistance);

      expect(prototype).toHaveProperty('pre', 'R');
      expect(prototype).toHaveProperty('kind', ElectronicKind.Resistance);
      expect(prototype).toHaveProperty('category', ElectronicCategory.Passive);
      expect(prototype).toHaveProperty('pins');
      expect(prototype).toHaveProperty('properties');
    });

    it('未知器件类型应该抛出异常', () => {
      expect(() => {
        getPartPrototype('UnknownKind' as unknown as ElectronicKind);
      }).toThrow('未知器件类型: UnknownKind');
    });
  });

  describe('getPartInfo()', () => {
    it('应该正确获取器件信息', () => {
      const info = getPartInfo(ElectronicKind.Resistance);

      expect(info).toEqual({
        name: '电阻',
        category: '无源器件',
      });
    });
  });

  describe('transformPartStoreToStructureData()', () => {
    it('应该正确转换存储数据为结构数据', () => {
      const storeData: PartStoreData = {
        kind: ElectronicKind.Resistance,
        referenceTag: '1',
        position: [10, 20],
        textDirection: Direction.Top,
        propertyValues: [{ value: 1000, rank: 'k' }],
      };

      const result = transformPartStoreToStructureData(storeData);

      expect(result).toHaveProperty('id');
      expect(result.id).toMatch(/^_\$part_/);
      expect(result.kind).toBe(ElectronicKind.Resistance);
      expect(result.referenceTag).toBe('1');
      expect(result.position).toEqual(new Point(10, 20));
      expect(result.propertyValues).toEqual([{ value: 1000, rank: 'k' }]);
      expect(result.rotate).toEqual(RotateMatrixSet[Rotate.Same]);
    });

    it('应该处理空的propertyValues', () => {
      const storeData: PartStoreData = {
        kind: ElectronicKind.Resistance,
        referenceTag: '1',
        position: [10, 20],
        textDirection: Direction.Top,
      };

      const result = transformPartStoreToStructureData(storeData);

      expect(result.propertyValues).toEqual([]);
    });
  });

  describe('transformPartStructureToStoreData()', () => {
    it('应该正确转换结构数据为存储数据', () => {
      const structureData: PartStructuredData = {
        id: '_$part_test123',
        kind: ElectronicKind.Resistance,
        referenceTag: '1',
        position: new Point(10, 20),
        rotate: [[1, 0], [0, 1]],
        propertyValues: [{ value: 1000, rank: 'k' }],
        textDirection: 0,
      };

      const result = transformPartStructureToStoreData(structureData);

      expect(result).toEqual({
        id: '_$part_test123',
        kind: ElectronicKind.Resistance,
        referenceTag: '1',
        position: [10, 20],
        propertyValues: [{ value: 1000, rank: 'k' }],
        rotate: undefined,
        textDirection: 0,
      });
    });

    it('应该处理空的propertyValues', () => {
      const structureData: PartStructuredData = {
        id: '_$part_test123',
        kind: ElectronicKind.Resistance,
        referenceTag: '1',
        position: new Point(10, 20),
        rotate: [[1, 0], [0, 1]],
        propertyValues: [],
        textDirection: 0,
      };

      const result = transformPartStructureToStoreData(structureData);

      expect(result).not.toHaveProperty('propertyValues');
    });

    it('应该处理非旋转矩阵', () => {
      const structureData: PartStructuredData = {
        id: '_$part_test123',
        kind: ElectronicKind.Resistance,
        referenceTag: '1',
        position: new Point(10, 20),
        rotate: [[1, 0], [0, 1]],
        propertyValues: [],
        textDirection: 0,
      };

      const result = transformPartStructureToStoreData(structureData);

      expect(result).toHaveProperty('rotate', undefined);
    });
  });

  describe('getPartPin()', () => {
    it('应该正确获取器件引脚数据', () => {
      const part: PartStructuredData = {
        id: '_$part_test123',
        kind: ElectronicKind.Resistance,
        referenceTag: '1',
        position: new Point(10, 20),
        rotate: [[1, 0], [0, 1]],
        propertyValues: [],
        textDirection: 0,
      };

      expect(getPartPin(part, 0)).toEqual({
        index: 0,
        position: new Point(-30, 20),
        origin: new Point(-40, 0),
        direction: new Point(-1, 0),
      });

      expect(getPartPin(part, 1)).toEqual({
        index: 1,
        position: new Point(50, 20),
        origin: new Point(40, 0),
        direction: new Point(1, 0),
      });
    });
  });

  describe('createPartByKind()', () => {
    it('应该正确创建器件', () => {
      const part = createPartByKind(ElectronicKind.Resistance);

      expect(part).toHaveProperty('id');
      expect(part.id).toMatch(/^_\$part_/);
      expect(part.kind).toBe(ElectronicKind.Resistance);
      expect(part.referenceTag).toBe('1');
      expect(part.position).toEqual(new Point(0, 0));
      expect(part.rotate).toEqual([[1, 0], [0, 1]]);
      expect(part.propertyValues).toHaveLength(1);
      expect(part.propertyValues[0]).toEqual({ value: 10, rank: 'k' });
    });

    it('应该正确生成引用编号', () => {
      const existingParts = [
        createPartByKind(ElectronicKind.Resistance),
        createPartByKind(ElectronicKind.Capacitor),
      ];

      const newPart = createPartByKind(ElectronicKind.Resistance, existingParts);

      expect(newPart.referenceTag).toBe('2');
    });
  });

  describe('createPartsByKind()', () => {
    it('应该正确创建多个器件', () => {
      const kinds = [ElectronicKind.Resistance, ElectronicKind.Capacitor];
      const parts = createPartsByKind(kinds);

      expect(parts).toHaveLength(2);
      expect(parts[0].kind).toBe(ElectronicKind.Resistance);
      expect(parts[1].kind).toBe(ElectronicKind.Capacitor);
      expect(parts[0].referenceTag).toBe('1');
      expect(parts[1].referenceTag).toBe('1');
    });
  });
});
