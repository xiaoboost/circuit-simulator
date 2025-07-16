import {
  Point,
  Rect,
  Direction,
  DirectionVectorSet,
} from '@circuit/algorithm';
import {
  LineOrPartStructuredData,
  PartStructuredData,
} from '@circuit/types';
import { definePlugin } from '../../../context';
import {
  ICollisionService,
  COLLISION_SERVICE,
  IEntityRegion,
} from '../../../types';
import { pointInRect, rectInRect, collision } from './collision';
import { getRectByEntity } from './create';

definePlugin(({ registerService }) => {
  const map = new Map<string, IEntityRegion>();
  const service: ICollisionService = {
    setEntity(entity: LineOrPartStructuredData) {
      return map.set(entity.id, getRectByEntity(entity));
    },
    removeEntity(id: string) {
      map.delete(id);
    },
    clearAll() {
      map.clear();
    },
    pointInEntities(point: Point) {
      const result: string[] = [];
      for (const [id, region] of map) {
        if (region.rects.some(rect => pointInRect(point, rect))) {
          result.push(id);
        }
      }
      return result;
    },
    rectCollides(rect: Rect) {
      const result: string[] = [];
      for (const [id, region] of map) {
        if (region.rects.some(r => collision(r, rect))) {
          result.push(id);
        }
      }
      return result;
    },
    isPositionAvailable(entity: LineOrPartStructuredData) {
      const { rects } = getRectByEntity(entity);
      return rects.every(r => {
        return this.rectCollides(r).length === 0;
      });
    },
    findNearestAvailablePosition(device: PartStructuredData, maxOffset = 20) {
      if (this.isPositionAvailable(device)) {
        return Point.from(device.position);
      }

      const directions = [
        Direction.Top,
        Direction.Bottom,
        Direction.Left,
        Direction.Right,
      ];

      for (let offset = 1; offset <= maxOffset; offset++) {
        for (const direction of directions) {
          const newPosition = device.position.add(
            DirectionVectorSet[direction].mul(20 * offset),
          );
          const newDevice = { ...device, position: newPosition };

          if (this.isPositionAvailable(newDevice)) {
            return newPosition;
          }
        }
      }

      return null;
    },
    getAllEntitiesCollisionRects() {
      return Array.from(map.values()).flatMap(region => region.rects);
    },
    getEntityBoundingBox(id: string) {
      const region = map.get(id);

      if (!region) {
        return;
      }

      const { rects } = region;

      if (rects.length === 0) {
        return;
      }

      let minX = Infinity, minY = Infinity;
      let maxX = -Infinity, maxY = -Infinity;

      for (const rect of rects) {
        minX = Math.min(minX, rect.x);
        minY = Math.min(minY, rect.y);
        maxX = Math.max(maxX, rect.x + rect.width);
        maxY = Math.max(maxY, rect.y + rect.height);
      }

      return {
        x: minX,
        y: minY,
        width: maxX - minX,
        height: maxY - minY,
      };
    },
    getEntityCollisionRects(id: string) {
      return map.get(id)?.rects ?? [];
    },
    getEntitiesInRect(rect: Rect) {
      const result: string[] = [];
      for (const [id, region] of map) {
        if (region.rects.every((r) => rectInRect(rect, r))) {
          result.push(id);
        }
      }
      return result;
    },
  };

  // 注册碰撞服务
  registerService(COLLISION_SERVICE, service);

  return () => {
    service.clearAll();
  };
});
