import { Point } from '@circuit/algorithm';
import type { LineStoreData, LineStructuredData } from '@circuit/types';
import { describe, it, expect } from 'vitest';

import {
  isLineId,
  copyLine,
  createLineByPath,
  createLine,
  getIndexVector,
  transformLineStoreToStructureData,
  transformLineStructureToStoreData,
} from '../src/operations';

describe('导线相关函数', () => {
  describe('isLineId()', () => {
    it('有效的导线ID应该返回true', () => {
      expect(isLineId('_$line_abc123')).toBe(true);
      expect(isLineId('_$Line_xyz789')).toBe(true);
    });

    it('无效的导线ID应该返回false', () => {
      expect(isLineId('_$part_abc123')).toBe(false);
      expect(isLineId('line_abc123')).toBe(false);
      expect(isLineId('_$line')).toBe(false);
      expect(isLineId('')).toBe(false);
    });
  });

  describe('copyLine()', () => {
    it('应该正确复制Point数组', () => {
      const original = [new Point(1, 2), new Point(3, 4)];
      const copied = copyLine(original);

      expect(copied).not.toBe(original);
      expect(copied).toHaveLength(2);
      expect(copied[0]).toEqual(new Point(1, 2));
      expect(copied[1]).toEqual(new Point(3, 4));
    });

    it('应该正确复制数字数组', () => {
      const original = [[1, 2], [3, 4]];
      const copied = copyLine(original);

      expect(copied).toHaveLength(2);
      expect(copied[0]).toEqual(new Point(1, 2));
      expect(copied[1]).toEqual(new Point(3, 4));
    });
  });

  describe('transformLineStoreToStructureData()', () => {
    it('应该正确转换存储数据为结构数据', () => {
      const storeData: LineStoreData = {
        path: [[1, 2], [3, 4]],
      };

      const result = transformLineStoreToStructureData(storeData);

      expect(result).toHaveProperty('id');
      expect(result.id).toMatch(/^_\$line_/);
      expect(result.path).toHaveLength(2);
      expect(result.path[0]).toEqual(new Point(1, 2));
      expect(result.path[1]).toEqual(new Point(3, 4));
    });
  });

  describe('transformLineStructureToStoreData()', () => {
    it('应该正确转换结构数据为存储数据', () => {
      const structureData: LineStructuredData = {
        id: '_$line_test123',
        path: [new Point(1, 2), new Point(3, 4)],
      };

      const result = transformLineStructureToStoreData(structureData);

      expect(result).toEqual({
        path: [[1, 2], [3, 4]],
      });
    });
  });

  describe('createLineByPath()', () => {
    it('应该从路径创建导线', () => {
      const path = [new Point(1, 2), new Point(3, 4)];
      const result = createLineByPath(path);

      expect(result).toHaveProperty('id');
      expect(result.id).toMatch(/^_\$line_/);
      expect(result.path).toHaveLength(2);
      expect(result.path[0]).toEqual(new Point(1, 2));
      expect(result.path[1]).toEqual(new Point(3, 4));
    });
  });

  describe('createLine()', () => {
    it('应该从起点创建导线', () => {
      const start = new Point(5, 6);
      const result = createLine(start);

      expect(result).toHaveProperty('id');
      expect(result.id).toMatch(/^_\$line_/);
      expect(result.path).toHaveLength(1);
      expect(result.path[0]).toEqual(new Point(5, 6));
    });
  });

  describe('getIndexVector()', () => {
    it('应该正确获取线段方向向量', () => {
      const path = [
        new Point(0, 0), new Point(2, 3), new Point(5, 7),
      ];
      const result = getIndexVector(path, 0);

      expect(result).toEqual(new Point(new Point(0, 0), new Point(2, 3)));
    });

    it('应该正确处理边界情况', () => {
      const path = [new Point(0, 0), new Point(2, 3)];
      const result = getIndexVector(path, 0);

      expect(result).toEqual(new Point(new Point(0, 0), new Point(2, 3)));
    });
  });
});
