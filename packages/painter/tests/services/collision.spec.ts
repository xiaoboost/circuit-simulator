import { Point, RotateMatrixSet, Rotate } from '@circuit/algorithm';
import { createPartByKind, createLineByPath } from '@circuit/electronics';
import { ElectronicKind, PartStructuredData, LineStructuredData } from '@circuit/types';
import { describe, it, expect, beforeEach } from 'vitest';
import { COLLISION_SERVICE, EntityKind, ICollisionService } from '../../src/types';
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

  describe('注册碰撞信息', () => {
    it('注册器件应该生成正确的碰撞矩形', () => {
      collision.setEntity(part);
      expect(collision.getAllEntitiesCollisionRects()).toEqual([
        { x: -32, y: -15, width: 64, height: 30 },
        { x: -48, y: -8, width: 16, height: 16 },
        { x: 32, y: -8, width: 16, height: 16 },
      ]);
    });

    it('旋转器件应该生成旋转后的碰撞矩形', () => {
      part.rotate = RotateMatrixSet[Rotate.Clockwise];
      collision.setEntity(part);
      expect(collision.getAllEntitiesCollisionRects()).toEqual([
        { x: -15, y: -32, width: 30, height: 64 },
        { x: -8, y: -48, width: 16, height: 16 },
        { x: -8, y: 32, width: 16, height: 16 },
      ]);
    });

    it('注册导线应该生成正确的碰撞矩形', () => {
      collision.setEntity(line);
      expect(collision.getAllEntitiesCollisionRects()).toEqual([
        { x: -7, y: -7, height: 114, width: 14 },
        { x: -7, y: 93, height: 14, width: 114 },
        { x: -8, y: -8, width: 16, height: 16 },
        { x: 92, y: 92, width: 16, height: 16 },
      ]);
    });
  });

  describe('获取点覆盖信息', () => {
    it('点应该正确覆盖多个实体', () => {
      const testLine = createLineByPath([
        Point.from([40, 0]),
        Point.from([40, 100]),
        Point.from([100, 100]),
      ]);

      collision.setEntity(part);
      collision.setEntity(testLine);

      expect(collision.pointInEntities(Point.from([40, 0]))).toEqual([
        { kind: EntityKind.PartPin, id: part.id, pin: 1 },
        { kind: EntityKind.Line, id: testLine.id, index: 0 },
        { kind: EntityKind.LinePin, id: testLine.id, pin: 0 },
      ]);
    });
  });
});
