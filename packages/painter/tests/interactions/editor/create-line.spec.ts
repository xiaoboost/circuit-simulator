import { Point, Direction, DirectionVectorSet, RotateMatrixSet, rotateMatrix, Rotate } from '@circuit/algorithm';
import { createPartByKind, createPartsByKind, createLineByPath } from '@circuit/electronics';
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
  IMapHashService,
  IConnectionService,
  Entity,
  EntityKind,
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
    map = await getPlugin(IMapHashService);
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

    describe('终点在导线上', () => {
      it('两个器件+空导线，导线终点在空的导线节点上，直接对齐此空节点，并且导线终点引脚是缩小状态', async () => {
        const data: StructuredData = {
          parts: [
            createPartByKind(ElectronicKind.Resistance),
            createPartByKind(ElectronicKind.Resistance),
          ],
          lines: [createLineByPath([Point.from([40, 0]), Point.from([100, 0])])],
        };

        const line2Id = 'line-2';
        const line1 = data.lines[0];
        const part2 = data.parts[1];
        part2.position = Point.from([200, 200]);

        const painterState = await createSearchEnv(data);
        const search = createDrawLineSearcher({
          lineId: line2Id,
          start: Point.from([160, 200]),
          direction: DirectionVectorSet[Direction.Left],
          painter: painterState,
        });

        painterState.setHover({
          id: line1.id,
          pin: 1,
          kind: EntityKind.LinePin,
        });

        expect(search(Point.from([102, 2]))).toEqual([
          {
            id: line2Id,
            pin: 1,
            style: PIN_DRAW_FIXED_STYLE,
          },
          {
            id: line2Id,
            path: [
              Point.from([160, 200]),
              Point.from([100, 200]),
              Point.from([100, 0]),
            ],
          },
        ]);
      });

      it('三个器件+一个已连接导线，已连接导线是水平方向，搜索导线有两个线段，导线最后的线段会对齐已有导线', async () => {
        const data: StructuredData = {
          parts: [
            createPartByKind(ElectronicKind.Resistance),
            createPartByKind(ElectronicKind.Resistance),
            createPartByKind(ElectronicKind.Resistance),
          ],
          lines: [createLineByPath([Point.from([40, 0]), Point.from([160, 0])])],
        };

        const line2Id = 'line-2';
        const line1 = data.lines[0];
        const part2 = data.parts[1];
        const part3 = data.parts[2];

        part2.position = Point.from([200, 0]);
        part3.position = Point.from([400, 400]);

        const painterState = await createSearchEnv(data);
        const search = createDrawLineSearcher({
          lineId: line2Id,
          start: Point.from([360, 400]),
          direction: DirectionVectorSet[Direction.Left],
          painter: painterState,
        });

        painterState.setHover({
          id: line1.id,
          index: 0,
          kind: EntityKind.Line,
        });

        // 初始对齐
        expect(search(Point.from([102, 2]))).toEqual([
          {
            id: line2Id,
            pin: 1,
            style: PIN_DRAW_FIXED_STYLE,
          },
          {
            id: line2Id,
            path: [
              Point.from([360, 400]),
              Point.from([102, 400]),
              Point.from([102, 0]),
            ],
          },
        ]);

        // 鼠标移动后再次对齐
        expect(search(Point.from([112, -2]))).toEqual([
          {
            id: line2Id,
            pin: 1,
            style: PIN_DRAW_FIXED_STYLE,
          },
          {
            id: line2Id,
            path: [
              Point.from([360, 400]),
              Point.from([112, 400]),
              Point.from([112, 0]),
            ],
          },
        ]);
      });

      it('三个器件+一个已连接导线，已连接导线是竖直方向，搜索导线有两个线段，导线最后的线段会对齐已有导线', async () => {
        const data: StructuredData = {
          parts: [
            createPartByKind(ElectronicKind.Resistance),
            createPartByKind(ElectronicKind.Resistance),
            createPartByKind(ElectronicKind.Resistance),
          ],
          lines: [createLineByPath([Point.from([40, 0]), Point.from([40, 200])])],
        };

        const line2Id = 'line-2';
        const line1 = data.lines[0];
        const part2 = data.parts[1];
        const part3 = data.parts[2];

        part2.position = Point.from([0, 200]);
        part3.position = Point.from([400, 400]);
        part3.rotate = rotateMatrix(part3.rotate, RotateMatrixSet[Rotate.Clockwise]);

        const painterState = await createSearchEnv(data);
        const search = createDrawLineSearcher({
          lineId: line2Id,
          start: Point.from([400, 360]),
          direction: DirectionVectorSet[Direction.Top],
          painter: painterState,
        });

        painterState.setHover({
          id: line1.id,
          index: 0,
          kind: EntityKind.Line,
        });

        // 初始对齐
        expect(search(Point.from([42, 102]))).toEqual([
          {
            id: line2Id,
            pin: 1,
            style: PIN_DRAW_FIXED_STYLE,
          },
          {
            id: line2Id,
            path: [
              Point.from([400, 360]),
              Point.from([400, 102]),
              Point.from([40, 102]),
            ],
          },
        ]);

        // 鼠标移动后再次对齐
        expect(search(Point.from([38, 112]))).toEqual([
          {
            id: line2Id,
            pin: 1,
            style: PIN_DRAW_FIXED_STYLE,
          },
          {
            id: line2Id,
            path: [
              Point.from([400, 360]),
              Point.from([400, 112]),
              Point.from([40, 112]),
            ],
          },
        ]);
      });

      it('三个器件+一个已连接导线，已连接导线是水平方向，搜索导线有两个线段，此时导线搜索只有一个线段', async () => {
        const data: StructuredData = {
          parts: [
            createPartByKind(ElectronicKind.Resistance),
            createPartByKind(ElectronicKind.Resistance),
            createPartByKind(ElectronicKind.Resistance),
          ],
          lines: [createLineByPath([Point.from([40, 0]), Point.from([40, 200])])],
        };

        const line2Id = 'line-2';
        const line1 = data.lines[0];
        const part2 = data.parts[1];
        const part3 = data.parts[2];

        part2.position = Point.from([0, 200]);
        part3.position = Point.from([200, 100]);

        const painterState = await createSearchEnv(data);
        const search = createDrawLineSearcher({
          lineId: line2Id,
          start: Point.from([160, 100]),
          direction: DirectionVectorSet[Direction.Left],
          painter: painterState,
        });

        painterState.setHover({
          id: line1.id,
          index: 0,
          kind: EntityKind.Line,
        });

        // 初始对齐
        expect(search(Point.from([42, 102]))).toEqual([
          {
            id: line2Id,
            pin: 1,
            style: PIN_DRAW_FIXED_STYLE,
          },
          {
            id: line2Id,
            path: [
              Point.from([160, 100]),
              Point.from([40, 100]),
            ],
          },
        ]);

        // 鼠标移动后再次对齐
        expect(search(Point.from([42, 162]))).toEqual([
          {
            id: line2Id,
            pin: 1,
            style: PIN_DRAW_FIXED_STYLE,
          },
          {
            id: line2Id,
            path: [
              Point.from([160, 100]),
              Point.from([40, 100]),
            ],
          },
        ]);

        // 鼠标移动后再次对齐
        expect(search(Point.from([42, 22]))).toEqual([
          {
            id: line2Id,
            pin: 1,
            style: PIN_DRAW_FIXED_STYLE,
          },
          {
            id: line2Id,
            path: [
              Point.from([160, 100]),
              Point.from([40, 100]),
            ],
          },
        ]);
      });

      it('三个器件+一个已连接导线，已连接导线是水平方向，搜索导线是从有两个线段，即将变为只有一个线段的途中，此时也是有两个线段', async () => {
        const data: StructuredData = {
          parts: [
            createPartByKind(ElectronicKind.Resistance),
            createPartByKind(ElectronicKind.Resistance),
            createPartByKind(ElectronicKind.Resistance),
          ],
          lines: [createLineByPath([Point.from([40, 0]), Point.from([260, 0])])],
        };

        const line2Id = 'line-2';
        const line1 = data.lines[0];
        const part2 = data.parts[1];
        const part3 = data.parts[2];

        part2.position = Point.from([300, 0]);
        part3.position = Point.from([200, 100]);

        const painterState = await createSearchEnv(data);
        const search = createDrawLineSearcher({
          lineId: line2Id,
          start: Point.from([160, 100]),
          direction: DirectionVectorSet[Direction.Left],
          painter: painterState,
        });

        painterState.setHover({
          id: line1.id,
          index: 0,
          kind: EntityKind.Line,
        });

        // 初始对齐
        expect(search(Point.from([102, 2]))).toEqual([
          {
            id: line2Id,
            pin: 1,
            style: PIN_DRAW_FIXED_STYLE,
          },
          {
            id: line2Id,
            path: [
              Point.from([160, 100]),
              Point.from([102, 100]),
              Point.from([102, 0]),
            ],
          },
        ]);

        // 右移至即将变化为只有一个线段时
        expect(search(Point.from([158, 2]))).toEqual([
          {
            id: line2Id,
            pin: 1,
            style: PIN_DRAW_FIXED_STYLE,
          },
          {
            id: line2Id,
            path: [
              Point.from([160, 100]),
              Point.from([158, 100]),
              Point.from([158, 0]),
            ],
          },
        ]);

        // 右移至只有一个线段时
        expect(search(Point.from([200, 2]))).toEqual([
          {
            id: line2Id,
            pin: 1,
            style: PIN_DRAW_FIXED_STYLE,
          },
          {
            id: line2Id,
            path: [
              Point.from([160, 100]),
              Point.from([160, 0]),
            ],
          },
        ]);
      });
    });
  });
});
