import { Point, Direction, RotateMatrixSet, Rotate } from '@circuit/algorithm';
import { PartStructuredData, LineStructuredData, ElectronicKind } from '@circuit/types';
import { describe, it, expect } from 'vitest';
import { COLLISION_SERVICE, EntityKind } from '../../src/types';
import { registerPlugin, getPlugin } from '../utils';

describe('碰撞服务', () => {
  registerPlugin('services/collision/register.ts');

  it('器件碰撞信息', async () => {
    const collision = await getPlugin(COLLISION_SERVICE);
    const part: PartStructuredData = {
      id: 'R_1',
      kind: ElectronicKind.Resistance,
      position: Point.from(0),
      textDirection: Direction.Top,
      propertyValues: [],
      rotate: RotateMatrixSet[Rotate.Same],
    };

    collision.setEntity(part);

    expect(collision.getAllEntitiesCollisionRects()).toEqual([
      { x: -32, y: -15, width: 64, height: 30 },
      { x: -48, y: -8, width: 16, height: 16 },
      { x: 32, y: -8, width: 16, height: 16 },
    ]);
  });

  it('导线碰撞信息', async () => {
    const collision = await getPlugin(COLLISION_SERVICE);
    const line: LineStructuredData = {
      id: 'L_1',
      path: [
        Point.from([0, 0]),
        Point.from([0, 100]),
        Point.from([100, 100]),
      ],
    };

    collision.setEntity(line);

    expect(collision.getAllEntitiesCollisionRects()).toEqual([
      { x: -7, y: -7, height: 114, width: 14 },
      { x: -7, y: 93, height: 14, width: 114 },
      { x: -8, y: -8, width: 16, height: 16 },
      { x: 92, y: 92, width: 16, height: 16 },
    ]);
  });

  it('器件碰撞信息-旋转', async () => {
    const collision = await getPlugin(COLLISION_SERVICE);
    const part: PartStructuredData = {
      id: 'R_1',
      kind: ElectronicKind.Resistance,
      position: Point.from(0),
      textDirection: Direction.Top,
      propertyValues: [],
      rotate: RotateMatrixSet[Rotate.Clockwise],
    };

    collision.setEntity(part);

    expect(collision.getAllEntitiesCollisionRects()).toEqual([
      { x: -15, y: -32, width: 30, height: 64 },
      { x: -8, y: -48, width: 16, height: 16 },
      { x: -8, y: 32, width: 16, height: 16 },
    ]);
  });

  it('获取点覆盖信息', async () => {
    const collision = await getPlugin(COLLISION_SERVICE);
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
        Point.from([40, 100]),
        Point.from([100, 100]),
      ],
    };

    collision.setEntity(part);
    collision.setEntity(line);

    expect(collision.pointInEntities(Point.from([40, 0]))).toEqual([
      { kind: EntityKind.PartPin, id: 'R_1', pin: 1 },
      { kind: EntityKind.Line, id: 'L_1', index: 0 },
      { kind: EntityKind.LinePin, id: 'L_1', pin: 0 },
    ]);
  });
});
