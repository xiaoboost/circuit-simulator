import { Point, RotateMatrixSet, Rotate } from '@circuit/algorithm';
import { createPartByKind, createLineByPath } from '@circuit/electronics';
import { ElectronicKind, PartStructuredData, LineStructuredData } from '@circuit/types';
import { describe, it, expect, beforeEach, beforeAll } from 'vitest';
import { ICollisionService } from '../../src/types';
import { registerPlugin, getPlugin } from '../utils';

describe('碰撞服务', () => {
  registerPlugin('services/collision/register.ts');

  let collision: ICollisionService;
  let part: PartStructuredData;
  let line: LineStructuredData;

  beforeAll(async () => {
    collision = await getPlugin(ICollisionService);
  });

  beforeEach(() => {
    collision.clearAll();
    part = createPartByKind(ElectronicKind.Resistance);
    line = createLineByPath([
      Point.from([0, 0]),
      Point.from([0, 100]),
      Point.from([100, 100]),
    ]);
  });

  describe('实体管理', () => {
    it('注册器件', () => {
      collision.setEntity(part);
      expect(collision.getEntityRects(part.id)).toEqual([
        { x: -32, y: -15, width: 64, height: 30 },
        { x: -48, y: -8, width: 16, height: 16 },
        { x: 32, y: -8, width: 16, height: 16 },
      ]);
    });

    it('注册旋转器件', () => {
      part.rotate = RotateMatrixSet[Rotate.Clockwise];
      collision.setEntity(part);
      expect(collision.getEntityRects(part.id)).toEqual([
        { x: -15, y: -32, width: 30, height: 64 },
        { x: -8, y: -48, width: 16, height: 16 },
        { x: -8, y: 32, width: 16, height: 16 },
      ]);
    });

    it('注册导线', () => {
      collision.setEntity(line);
      expect(collision.getEntityRects(line.id)).toEqual([
        { x: -7, y: -7, height: 114, width: 14 },
        { x: -7, y: 93, height: 14, width: 114 },
        { x: -8, y: -8, width: 16, height: 16 },
        { x: 92, y: 92, width: 16, height: 16 },
      ]);
    });

    it('更新已存在的实体', () => {
      collision.setEntity(part);
      // 移动器件位置
      part.position = Point.from([100, 100]);
      collision.setEntity(part);
      expect(collision.getEntityRects(part.id)).toEqual([
        { x: 68, y: 85, width: 64, height: 30 },
        { x: 52, y: 92, width: 16, height: 16 },
        { x: 132, y: 92, width: 16, height: 16 },
      ]);
    });

    it('移除实体后，碰撞矩形应该为空', () => {
      collision.setEntity(part);
      collision.removeEntity(part.id);
      expect(collision.getEntityRects(part.id)).toEqual([]);
    });

    it('移除不存在的实体后，碰撞矩形不受影响', () => {
      collision.setEntity(part);
      collision.removeEntity('non-existent-id');
      expect(collision.getEntityRects(part.id)).toEqual([
        { x: -32, y: -15, width: 64, height: 30 },
        { x: -48, y: -8, width: 16, height: 16 },
        { x: 32, y: -8, width: 16, height: 16 },
      ]);
    });

    it('清空所有实体应该移除所有碰撞信息', () => {
      collision.setEntity(part);
      collision.setEntity(line);
      collision.clearAll();
      expect(collision.getEntityRects(part.id)).toEqual([]);
      expect(collision.getEntityRects(line.id)).toEqual([]);
      expect(collision.getAllEntityRects()).toEqual([]);
    });
  });

  describe('实体碰撞检测', () => {
    it('新实体不与现有实体碰撞应该返回 false', () => {
      collision.setEntity(part);
      const newPart = createPartByKind(ElectronicKind.Capacitor);
      newPart.position = Point.from([200, 200]);
      expect(collision.isEntityCollision(newPart)).toBe(false);
    });

    it('新实体与现有实体碰撞应该返回 true', () => {
      collision.setEntity(part);
      const newPart = createPartByKind(ElectronicKind.Capacitor);
      // 与 part 重叠
      newPart.position = Point.from([0, 0]);
      expect(collision.isEntityCollision(newPart)).toBe(true);
    });

    it('空碰撞系统应该返回 false', () => {
      const newPart = createPartByKind(ElectronicKind.Capacitor);
      expect(collision.isEntityCollision(newPart)).toBe(false);
    });
  });

  describe('查找最近的无碰撞位置', () => {
    it('实体无碰撞时应该返回零偏移', () => {
      const newPart = createPartByKind(ElectronicKind.Capacitor);
      newPart.position = Point.from([200, 200]);
      const result = collision.findNearestNotCollisionPosition(newPart);
      expect(result).toEqual(Point.from([0, 0]));
    });

    it('实体有碰撞时应该返回有效偏移', () => {
      collision.setEntity(part);
      const newPart = createPartByKind(ElectronicKind.Capacitor);
      newPart.position = Point.from([0, 0]);
      const result = collision.findNearestNotCollisionPosition(newPart);
      expect(result).toEqual(Point.from([0, -40]));
    });

    it('超过最大偏移时应该返回 null', () => {
      collision.setEntity(part);
      const newPart = createPartByKind(ElectronicKind.Capacitor);
      newPart.position = Point.from([0, 0]);
      const result = collision.findNearestNotCollisionPosition(newPart, 10); // 很小的最大偏移
      expect(result).toBeNull();
    });
  });

  describe('获取实体边界框', () => {
    it('单个器件边界框', () => {
      collision.setEntity(part);
      expect(collision.getEntityBoundingBox(part.id))
        .toEqual({ x: -48, y: -15, width: 96, height: 30 });
    });

    it('单个导线边界框', () => {
      collision.setEntity(line);
      expect(collision.getEntityBoundingBox(line.id))
        .toEqual({ x: -8, y: -8, width: 116, height: 116 });
    });

    it('不存在的实体应该返回 undefined', () => {
      expect(collision.getEntityBoundingBox('non-existent-id')).toBeUndefined();
    });

    it('空碰撞系统应该返回 undefined', () => {
      expect(collision.getEntityBoundingBox(part.id)).toBeUndefined();
    });

    it('多个器件的边界框', () => {
      const part1 = createPartByKind(ElectronicKind.Resistance);
      const part2 = createPartByKind(ElectronicKind.Capacitor);
      part1.position = Point.from([0, 0]);
      part2.position = Point.from([100, 0]);

      collision.setEntity(part1);
      collision.setEntity(part2);

      const result = collision.getEntityBoundingBox(part1.id, part2.id);
      expect(result).toEqual({ x: -48, y: -18, width: 196, height: 36 });
    });

    it('器件和导线的混合边界框', () => {
      collision.setEntity(part);
      collision.setEntity(line);

      const result = collision.getEntityBoundingBox(part.id, line.id);
      expect(result).toEqual({ x: -48, y: -15, width: 156, height: 123 });
    });

    it('多个导线的边界框', () => {
      const line1 = createLineByPath([
        Point.from([0, 0]),
        Point.from([0, 50]),
      ]);
      const line2 = createLineByPath([
        Point.from([100, 0]),
        Point.from([100, 50]),
      ]);

      collision.setEntity(line1);
      collision.setEntity(line2);

      const result = collision.getEntityBoundingBox(line1.id, line2.id);
      expect(result).toEqual({ x: -8, y: -8, width: 116, height: 66 });
    });

    it('部分存在的实体ID应该忽略不存在的ID', () => {
      collision.setEntity(part);

      const result = collision.getEntityBoundingBox(part.id, 'non-existent-id');
      expect(result).toEqual({ x: -48, y: -15, width: 96, height: 30 });
    });

    it('所有ID都不存在时应该返回 undefined', () => {
      const result = collision.getEntityBoundingBox('non-existent-id-1', 'non-existent-id-2');
      expect(result).toBeUndefined();
    });

    it('空ID数组应该返回 undefined', () => {
      const result = collision.getEntityBoundingBox();
      expect(result).toBeUndefined();
    });

    it('多个器件的分散边界框', () => {
      const part1 = createPartByKind(ElectronicKind.Resistance);
      const part2 = createPartByKind(ElectronicKind.Capacitor);
      const part3 = createPartByKind(ElectronicKind.Inductance);

      part1.position = Point.from([0, 0]);
      part2.position = Point.from([200, 0]);
      part3.position = Point.from([100, 100]);

      collision.setEntity(part1);
      collision.setEntity(part2);
      collision.setEntity(part3);

      const result = collision.getEntityBoundingBox(part1.id, part2.id, part3.id);
      expect(result).toEqual({ x: -48, y: -18, width: 296, height: 126 });
    });

    it('垂直排列的多个器件边界框', () => {
      const part1 = createPartByKind(ElectronicKind.Resistance);
      const part2 = createPartByKind(ElectronicKind.Capacitor);

      part1.position = Point.from([0, 0]);
      part2.position = Point.from([0, 100]);

      collision.setEntity(part1);
      collision.setEntity(part2);

      const result = collision.getEntityBoundingBox(part1.id, part2.id);
      expect(result).toEqual({ x: -48, y: -15, width: 96, height: 133 });
    });
  });

  describe('获取矩形内的元件', () => {
    it('应该返回完全在矩形内的元件', () => {
      collision.setEntity(part);
      const testRect = { x: -50, y: -50, width: 100, height: 100 };
      const result = collision.getElectronicsInRect(testRect);

      expect(result).toBeInstanceOf(Set);
      expect(result.has(part.id)).toBe(true);
    });

    it('部分在矩形内的元件不应该被包含', () => {
      collision.setEntity(part);
      const testRect = { x: 0, y: 0, width: 10, height: 10 }; // 只覆盖part的一部分
      const result = collision.getElectronicsInRect(testRect);

      expect(result.has(part.id)).toBe(false);
    });

    it('空碰撞系统应该返回空 Set', () => {
      const testRect = { x: 0, y: 0, width: 100, height: 100 };
      const result = collision.getElectronicsInRect(testRect);

      expect(result).toBeInstanceOf(Set);
      expect(result.size).toBe(0);
    });

    it('多个元件在矩形内应该全部返回', () => {
      const part1 = createPartByKind(ElectronicKind.Resistance);
      const part2 = createPartByKind(ElectronicKind.Capacitor);
      part1.position = Point.from([0, 0]);
      part2.position = Point.from([100, 0]);

      collision.setEntity(part1);
      collision.setEntity(part2);

      const testRect = { x: -50, y: -50, width: 200, height: 100 };
      const result = collision.getElectronicsInRect(testRect);

      expect(result.has(part1.id)).toBe(true);
      expect(result.has(part2.id)).toBe(true);
      expect(result.size).toBe(2);
    });

    it('边界完全重合的矩形应该被包含', () => {
      collision.setEntity(part);
      // 创建一个与 part 边界完全重合的矩形
      const testRect = { x: -48, y: -15, width: 96, height: 30 };
      const result = collision.getElectronicsInRect(testRect);

      expect(result.has(part.id)).toBe(true);
    });

    it('边界稍微超出给定矩形的元件不应该被包含', () => {
      collision.setEntity(part);
      // 创建一个稍微小于 part 边界的矩形
      const testRect = { x: -47, y: -14, width: 94, height: 28 };
      const result = collision.getElectronicsInRect(testRect);

      expect(result.has(part.id)).toBe(false);
    });

    it('导线完全在矩形内应该被包含', () => {
      collision.setEntity(line);
      const testRect = { x: -10, y: -10, width: 120, height: 120 };
      const result = collision.getElectronicsInRect(testRect);

      expect(result.has(line.id)).toBe(true);
    });

    it('导线部分超出矩形边界不应该被包含', () => {
      collision.setEntity(line);
      const testRect = { x: 0, y: 0, width: 100, height: 100 };
      const result = collision.getElectronicsInRect(testRect);

      expect(result.has(line.id)).toBe(false);
    });

    it('多个元件中只有部分完全在矩形内', () => {
      const part1 = createPartByKind(ElectronicKind.Resistance);
      const part2 = createPartByKind(ElectronicKind.Capacitor);
      const part3 = createPartByKind(ElectronicKind.Inductance);

      part1.position = Point.from([0, 0]);
      part2.position = Point.from([100, 0]);
      part3.position = Point.from([200, 0]);

      collision.setEntity(part1);
      collision.setEntity(part2);
      collision.setEntity(part3);

      // 只包含前两个元件的矩形
      const testRect = { x: -50, y: -50, width: 150, height: 100 };
      const result = collision.getElectronicsInRect(testRect);

      expect(result.has(part1.id)).toBe(true);
      expect(result.has(part2.id)).toBe(true);
      expect(result.has(part3.id)).toBe(false);
      expect(result.size).toBe(2);
    });

    it('矩形完全在元件内部时不应该返回该元件', () => {
      collision.setEntity(part);
      // 创建一个完全在 part 内部的矩形
      const testRect = { x: -30, y: -10, width: 20, height: 20 };
      const result = collision.getElectronicsInRect(testRect);

      expect(result.has(part.id)).toBe(false);
    });
  });
});
