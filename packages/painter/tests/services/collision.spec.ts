import { Point, RotateMatrixSet, Rotate } from '@circuit/algorithm';
import { createPartByKind, createLineByPath } from '@circuit/electronics';
import { ElectronicKind, PartStructuredData, LineStructuredData } from '@circuit/types';
import { describe, it, expect, beforeEach } from 'vitest';
import { COLLISION_SERVICE, ICollisionService } from '../../src/types';
import { registerPlugin, getPlugin } from '../utils';

describe('碰撞服务', () => {
  registerPlugin('services/collision/register.ts');

  let collision: ICollisionService;
  let part: PartStructuredData;
  let line: LineStructuredData;

  beforeEach(async () => {
    collision = await getPlugin(COLLISION_SERVICE);
    part = createPartByKind(ElectronicKind.Resistance, []);
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
      const newPart = createPartByKind(ElectronicKind.Capacitor, []);
      newPart.position = Point.from([200, 200]);
      expect(collision.isEntityCollision(newPart)).toBe(false);
    });

    it('新实体与现有实体碰撞应该返回 true', () => {
      collision.setEntity(part);
      const newPart = createPartByKind(ElectronicKind.Capacitor, []);
      // 与 part 重叠
      newPart.position = Point.from([0, 0]);
      expect(collision.isEntityCollision(newPart)).toBe(true);
    });

    it('空碰撞系统应该返回 false', () => {
      const newPart = createPartByKind(ElectronicKind.Capacitor, []);
      expect(collision.isEntityCollision(newPart)).toBe(false);
    });
  });

  describe('查找最近的无碰撞位置', () => {
    it('实体无碰撞时应该返回零偏移', () => {
      const newPart = createPartByKind(ElectronicKind.Capacitor, []);
      newPart.position = Point.from([200, 200]);
      const result = collision.findNearestNotCollisionPosition(newPart);
      expect(result).toEqual(Point.from([0, 0]));
    });

    it('实体有碰撞时应该返回有效偏移', () => {
      collision.setEntity(part);
      const newPart = createPartByKind(ElectronicKind.Capacitor, []);
      newPart.position = Point.from([0, 0]);
      const result = collision.findNearestNotCollisionPosition(newPart);
      expect(result).toEqual(Point.from([0, -40]));
    });

    it('超过最大偏移时应该返回 null', () => {
      collision.setEntity(part);
      const newPart = createPartByKind(ElectronicKind.Capacitor, []);
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
      const part1 = createPartByKind(ElectronicKind.Resistance, []);
      const part2 = createPartByKind(ElectronicKind.Capacitor, []);
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
  });
});
