import { Point, Direction, DirectionVectorSet } from '@circuit/algorithm';
import { createPartByKind } from '@circuit/electronics';
import {
  ElectronicKind,
  StructuredData,
} from '@circuit/types';
import { describe, it, expect } from 'vitest';
import {
  createDrawLineSearcher,
  PainterState,
  PIN_DRAW_EXPANDED_STYLE,
} from '../../../src/plugins/interactions/editor/utils';
import { MAP_HASH_SERVICE, CONNECTION_SERVICE, Entity, EntityKind } from '../../../src/types';
import { registerPlugin, getPlugin } from '../../utils';

async function createSearchEnv(data: StructuredData) {
  const map = await getPlugin(MAP_HASH_SERVICE);
  const connection = await getPlugin(CONNECTION_SERVICE);

  map.createFromData(data);
  connection.createFromData(data);

  let hover: Entity | undefined;

  const state: PainterState = {
    ...map,
    ...connection,
    getHover: () => hover,
    getPart: (id: string) => {
      return data.parts.find(part => part.id === id);
    },
    getLine: (id: string) => {
      return data.lines.find(line => line.id === id);
    },
    getConnection: (id: string, pin: number) => {
      return connection.getConnections(id, pin);
    },
  };

  return {
    ...state,
    setHover: (entity: Entity) => {
      hover = entity;
    },
  };
}

describe('创建导线搜索路径', () => {
  registerPlugin([
    'services/map-hash/register.ts',
    'services/connection/register.ts',
  ]);

  describe('器件引脚开始创建导线', () => {
    it('创建导线时，鼠标在起点引脚附近，此时的路径应该仅有起点坐标', async() => {
      const part = createPartByKind(ElectronicKind.Resistance, []);
      const lineId = 'line-1';
      const data: StructuredData = {
        parts: [part],
        lines: [],
      };
      const painterState = await createSearchEnv(data);
      const search = createDrawLineSearcher({
        lineId,
        start: Point.from([40, 0]),
        direction: DirectionVectorSet[Direction.Right],
        painter: painterState,
      });

      // 初始时鼠标悬停在引脚上
      painterState.setHover({
        id: part.id,
        kind: EntityKind.PartPin,
        pin: 1,
      });
      // 初始终点设置在引脚附近
      const end = Point.from([44, 5]);

      expect(search(end)).toEqual([
        {
          id: lineId,
          pin: 1,
          style: PIN_DRAW_EXPANDED_STYLE,
        },
        {
          id: lineId,
          path: [
            Point.from([40, 0]),
          ],
        },
      ]);
    });

    it('创建导线时，终点在起点右侧空白处，此时路径应该是两段线段', async() => {
      const part = createPartByKind(ElectronicKind.Resistance, []);
      const lineId = 'line-1';
      const data: StructuredData = {
        parts: [part],
        lines: [],
      };
      const painterState = await createSearchEnv(data);
      const search = createDrawLineSearcher({
        lineId,
        start: Point.from([40, 0]),
        direction: DirectionVectorSet[Direction.Right],
        painter: painterState,
      });

      // 初始终点设置在引脚附近
      const end = Point.from([218, 206]);

      expect(search(end)).toEqual([
        {
          id: lineId,
          pin: 1,
          style: PIN_DRAW_EXPANDED_STYLE,
        },
        {
          id: lineId,
          path: [
            Point.from([40, 0]),
            Point.from([218, 0]),
            Point.from([218, 206]),
          ],
        },
      ]);
    });

    it('创建导线时，终点在起点左侧空白处，此时路径应该是两段线段', async() => {
      const part = createPartByKind(ElectronicKind.Resistance, []);
      const lineId = 'line-1';
      const data: StructuredData = {
        parts: [part],
        lines: [],
      };
      const painterState = await createSearchEnv(data);
      const search = createDrawLineSearcher({
        lineId,
        start: Point.from([40, 0]),
        direction: DirectionVectorSet[Direction.Right],
        painter: painterState,
      });

      // 初始终点设置在引脚附近
      const end = Point.from([-54, 97]);

      expect(search(end)).toEqual([
        {
          id: lineId,
          pin: 1,
          style: PIN_DRAW_EXPANDED_STYLE,
        },
        {
          id: lineId,
          path: [
            Point.from([40, 0]),
            Point.from([40, 97]),
            Point.from([-54, 97]),
          ],
        },
      ]);
    });
  });
});
