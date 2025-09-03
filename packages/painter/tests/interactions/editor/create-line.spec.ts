import { Point, Direction, DirectionVectorSet } from '@circuit/algorithm';
import { createPartByKind, createPartsByKind } from '@circuit/electronics';
import {
  ElectronicKind,
  StructuredData,
} from '@circuit/types';
import {
  it,
  expect,
  describe,
  beforeAll,
  beforeEach,
} from 'vitest';
import {
  createDrawLineSearcher,
  PainterState,
  PIN_DRAW_EXPANDED_STYLE,
  PIN_DRAW_FIXED_STYLE,
} from '../../../src/plugins/interactions/editor/utils';
import {
  IMapHashMarkService,
  IConnectionService,
  Entity,
  EntityKind,
  IMapHashService,
  IConnectionService,
} from '../../../src/types';
import { registerPlugin, getPlugin } from '../../utils';

describe('创建导线搜索路径', () => {
  registerPlugin([
    'services/map-hash/register.ts',
    'services/connection/register.ts',
  ]);

  let map: IMapHashService;
  let connection: IConnectionService;

  beforeAll(async () => {
    map = await getPlugin(IMapHashMarkService);
    connection = await getPlugin(IConnectionService);
  });

  beforeEach(() => {
    map.clearAll();
    connection.clearAll();
  });

  async function createSearchEnv(data: StructuredData) {
    map.createFromData(data);
    connection.createFromData(data);

    let hover: Entity | undefined;

    const state: PainterState = {
      ...map,
      ...connection,
      getHover: () => hover,
      getPart: (id: string) => {
        return data.parts.find((part) => part.id === id);
      },
      getLine: (id: string) => {
        return data.lines.find((line) => line.id === id);
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

  describe('器件引脚开始创建导线', () => {
    describe('终点在空白区域', () => {
      it('单器件，终点在起点左侧空白处，此时路径应该是两段线段', async () => {
        const lineId = 'line-1';
        const data: StructuredData = {
          parts: [createPartByKind(ElectronicKind.Resistance)],
          lines: [],
        };
        const painterState = await createSearchEnv(data);
        const search = createDrawLineSearcher({
          lineId,
          start: Point.from([40, 0]),
          direction: DirectionVectorSet[Direction.Right],
          painter: painterState,
        });

        // 初始终点设置在左侧空白处
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

      it('单器件，终点在起点右侧空白处，此时路径应该是两段线段', async () => {
        const lineId = 'line-1';
        const data: StructuredData = {
          parts: [createPartByKind(ElectronicKind.Resistance)],
          lines: [],
        };
        const painterState = await createSearchEnv(data);
        const search = createDrawLineSearcher({
          lineId,
          start: Point.from([40, 0]),
          direction: DirectionVectorSet[Direction.Right],
          painter: painterState,
        });

        // 初始终点设置在右侧空白处
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

      it('单器件，单边宽度不超过20（一格的长度），终点在空白区域靠近器件内部，此时路径应该是两段线段', async () => {
        const lineId = 'line-1';
        const data: StructuredData = {
          parts: [createPartByKind(ElectronicKind.Resistance)],
          lines: [],
        };
        const painterState = await createSearchEnv(data);
        const search = createDrawLineSearcher({
          lineId,
          start: Point.from([40, 0]),
          direction: DirectionVectorSet[Direction.Right],
          painter: painterState,
        });

        const end = Point.from([35, -10]);

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
              Point.from([40, -10]),
              Point.from([35, -10]),
            ],
          },
        ]);
      });

      it('单器件，单边宽度超过20（一格的长度），终点在空白区域靠近器件内部，此时路径应该只有一条线段', async () => {
        const lineId = 'line-1';
        const data: StructuredData = {
          parts: [createPartByKind(ElectronicKind.AcVoltageSource)],
          lines: [],
        };
        const painterState = await createSearchEnv(data);
        const search = createDrawLineSearcher({
          lineId,
          start: Point.from([40, 0]),
          direction: DirectionVectorSet[Direction.Right],
          painter: painterState,
        });

        const end = Point.from([35, -10]);

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
              Point.from([40, -10]),
            ],
          },
        ]);
      });

      it('两个器件，另一个挡住了路径，终点在起点右侧空白处，此时路径应该是三段线段', async () => {
        const parts = createPartsByKind([
          ElectronicKind.Resistance,
          ElectronicKind.Resistance,
        ]);

        // 第二个器件在第一个器件右侧，并且挡住导线前进路径
        parts[1].position = Point.from([60, 40]);

        const lineId = 'line-1';
        const data: StructuredData = {
          parts,
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
        const end = Point.from([97, 104]);

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
              Point.from([120, 0]),
              Point.from([120, 104]),
              Point.from([97, 104]),
            ],
          },
        ]);
      });

      // TODO: 还缺终点所在空白被围起来的情况
    });

    describe('终点在器件上', () => {
      it('单器件，鼠标在起点引脚附近，此时的路径应该有两个起点坐标组成的路径，导线终点引脚是放大状态', async () => {
        const lineId = 'line-1';
        const data: StructuredData = {
          parts: [createPartByKind(ElectronicKind.Resistance)],
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
          id: data.parts[0].id,
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
              Point.from([40, 0]),
            ],
          },
        ]);
      });

      it('单器件，鼠标在器件上，但是更靠近起点，此时的路径应该有两个起点坐标组成的路径，导线终点引脚是放大状态', async () => {
        const lineId = 'line-1';
        const data: StructuredData = {
          parts: [createPartByKind(ElectronicKind.Resistance)],
          lines: [],
        };
        const painterState = await createSearchEnv(data);
        const search = createDrawLineSearcher({
          lineId,
          start: Point.from([40, 0]),
          direction: DirectionVectorSet[Direction.Right],
          painter: painterState,
        });

        // 初始时鼠标悬停在器件上
        painterState.setHover({
          id: data.parts[0].id,
          kind: EntityKind.Part,
        });
        // 初始终点设置在引脚附近
        const end = Point.from([10, 0]);

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
              Point.from([40, 0]),
            ],
          },
        ]);
      });

      it('单器件，鼠标在器件上，但是更靠近器件的另一个坐标，此时的导线应该把两个引脚连接起来，导线终点引脚是缩小状态', async () => {
        const lineId = 'line-1';
        const data: StructuredData = {
          parts: [createPartByKind(ElectronicKind.Resistance)],
          lines: [],
        };
        const painterState = await createSearchEnv(data);
        const search = createDrawLineSearcher({
          lineId,
          start: Point.from([40, 0]),
          direction: DirectionVectorSet[Direction.Right],
          painter: painterState,
        });

        // 初始时鼠标悬停在器件上
        painterState.setHover({
          id: data.parts[0].id,
          kind: EntityKind.Part,
        });
        // 初始终点设置在引脚附近
        const end = Point.from([-10, 0]);

        expect(search(end)).toEqual([
          {
            id: lineId,
            pin: 1,
            style: PIN_DRAW_FIXED_STYLE,
          },
          {
            id: lineId,
            path: [
              Point.from([40, 0]),
              Point.from([40, 20]),
              Point.from([-40, 20]),
              Point.from([-40, 0]),
            ],
          },
        ]);
      });

      it('两个器件，鼠标在另一个器件上，此器件有空余引脚，导线会连接到鼠标更接近的引脚', async () => {
        const lineId = 'line-1';
        const data: StructuredData = {
          parts: [
            createPartByKind(ElectronicKind.Resistance),
            createPartByKind(ElectronicKind.Resistance),
          ],
          lines: [],
        };

        data.parts[1].position = Point.from([120, 120]);

        const painterState = await createSearchEnv(data);
        const search = createDrawLineSearcher({
          lineId,
          start: Point.from([40, 0]),
          direction: DirectionVectorSet[Direction.Right],
          painter: painterState,
        });

        // 初始时鼠标悬停在器件上
        painterState.setHover({
          id: data.parts[1].id,
          kind: EntityKind.Part,
        });
        // 初始终点设置在引脚附近
        const end = Point.from([100, 120]);

        expect(search(end)).toEqual([
          {
            id: lineId,
            pin: 1,
            style: PIN_DRAW_FIXED_STYLE,
          },
          {
            id: lineId,
            path: [
              Point.from([40, 0]),
              Point.from([80, 0]),
              Point.from([80, 120]),
            ],
          },
        ]);
      });

      // TODO: 还缺器件没有空余引脚的情况
    });

    // TODO: 还缺器件在导线上的情况
  });
});
