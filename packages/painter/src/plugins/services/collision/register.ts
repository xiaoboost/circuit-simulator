import {
  Point,
  Rect,
  Direction,
  DirectionVectorSet,
} from '@circuit/algorithm';
import { LineOrPartStructuredData } from '@circuit/types';
import { definePlugin } from '../../../context';
import {
  ICollisionService,
  COLLISION_SERVICE,
  IEntityRegion,
  Entity,
} from '../../../types';
import { pointInRect, rectInRect, collision, rectOffset } from './collision';
import { getRectByEntity } from './create';

definePlugin(({ registerService }) => {
  const map = new Map<string, IEntityRegion>();
  const service: ICollisionService = {
    createFromData(data) {
      for (const part of data.parts) {
        this.setEntity(part);
      }
      for (const line of data.lines) {
        this.setEntity(line);
      }
    },
    setEntity(entity: LineOrPartStructuredData) {
      for (const region of getRectByEntity(entity)) {
        map.set(region.id, region);
      }
    },
    removeEntity(id: string) {
      for (const region of this.getEntityRegion(id) ?? []) {
        map.delete(region.id);
      }
    },
    clearAll() {
      map.clear();
    },
    pointInEntities(point: Point) {
      const result: Entity[] = [];
      for (const region of map.values()) {
        if (region.rects.some(rect => pointInRect(point, rect))) {
          result.push(region.entity);
        }
      }
      return result;
    },
    rectInEntities(rect: Rect) {
      const result: Entity[] = [];
      for (const region of map.values()) {
        if (region.rects.some(r => collision(r, rect))) {
          result.push(region.entity);
        }
      }
      return result;
    },
    isEntityCollision(entity: LineOrPartStructuredData) {
      const regions = getRectByEntity(entity);
      return regions.some(({ rects }) => {
        return rects.some((r) => {
          return this.rectInEntities(r).length > 0;
        });
      });
    },
    findNearestNotCollisionPosition(device: LineOrPartStructuredData, maxOffset = 400) {
      const entity = getRectByEntity(device);
      const rects = entity.flatMap(({ rects }) => rects);
      const isCollision = (rects: Rect[]) => rects.some((r) => {
        return this.rectInEntities(r).length > 0;
      });

      if (!isCollision(rects)) {
        return Point.from(0);
      }

      const perBias = 20;
      const directions = [
        Direction.Top,
        Direction.Bottom,
        Direction.Left,
        Direction.Right,
      ];

      for (let offset = 1; offset <= maxOffset / perBias; offset++) {
        for (const direction of directions) {
          const bias = DirectionVectorSet[direction].mul(20 * offset);
          const newRects = rects.map((r) => rectOffset(r, bias));

          if (!isCollision(newRects)) {
            return bias;
          }
        }
      }

      return null;
    },
    getEntityRegion(id: string) {
      const result: IEntityRegion[] = [];
      for (const region of map.values()) {
        if (region.entity.id === id) {
          result.push(region);
        }
      }
      return result;
    },
    getEntityRects(id) {
      return this.getEntityRegion(id).flatMap((region) => region.rects);
    },
    getAllEntityRects() {
      return Array.from(map.values()).flatMap(region => region.rects);
    },
    getEntityBoundingBox(...ids: string[]) {
      const rects = ids.flatMap(id => this.getEntityRects(id));

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
    getElectronicsInRect(rect: Rect) {
      const result = new Set<string>();

      for (const region of map.values()) {
        if (region.rects.every((r) => rectInRect(rect, r))) {
          result.add(region.entity.id);
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
