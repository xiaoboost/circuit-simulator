import { Point } from '@circuit/algorithm';
import { createPartByKind, createLineByPath } from '@circuit/electronics';
import { ElectronicKind } from '@circuit/types';
import { describe, it, expect, beforeEach, beforeAll } from 'vitest';
import { IConnectionService } from '../../src/types';
import { registerPlugin, getPlugin } from '../utils';

describe('连接服务', () => {
  registerPlugin('services/connection/register.ts');

  let connection: IConnectionService;
  const part = createPartByKind(ElectronicKind.Resistance);
  const line = createLineByPath([
    Point.from([40, 0]),
    Point.from([80, 0]),
  ]);

  beforeAll(async () => {
    connection = await getPlugin(IConnectionService);
  });

  beforeEach(() => {
    connection.clearAll();
  });

  describe('空器件处理', () => {
    it('空器件应该没有连接', async () => {
      connection.createFromData({
        parts: [part],
        lines: [],
      });

      expect(connection.getConnections(part.id)).toEqual([]);
    });
  });

  describe('基本连接', () => {
    beforeEach(() => {
      connection.createFromData({
        parts: [part],
        lines: [line],
      });
    });

    it('器件引脚0应该没有连接', () => {
      expect(connection.getConnections(part.id, 0)).toEqual([]);
    });

    it('器件引脚1应该连接到导线', () => {
      expect(connection.getConnections(part.id, 1)).toEqual([
        {
          id: line.id,
          pin: 0,
          originPin: 1,
        },
      ]);
    });

    it('导线应该连接到器件', () => {
      expect(connection.getConnections(line.id)).toEqual([
        {
          id: part.id,
          pin: 1,
          originPin: 0,
        },
      ]);
    });
  });

  describe('移除导线', () => {
    beforeEach(() => {
      connection.createFromData({
        parts: [part],
        lines: [line],
      });
    });

    it('移除导线前器件应该有连接', () => {
      expect(connection.getConnections(part.id)).toEqual([
        {
          id: line.id,
          pin: 0,
          originPin: 1,
        },
      ]);
    });

    it('移除导线后器件应该没有连接', () => {
      connection.removeDevice(line.id);
      expect(connection.getConnections(part.id)).toEqual([]);
    });
  });

  describe('底层连接管理 API', () => {
    describe('registerPin', () => {
      it('应该能注册器件的引脚', () => {
        connection.registerPin('device1', 0);
        connection.registerPin('device1', 1);
        connection.registerPin('device2', 0);

        expect(connection.getConnections('device1')).toEqual([]);
        expect(connection.getConnections('device1', 0)).toEqual([]);
        expect(connection.getConnections('device1', 1)).toEqual([]);
        expect(connection.getConnections('device2', 0)).toEqual([]);
      });

      it('重复注册同一引脚应该不会出错', () => {
        connection.registerPin('device1', 0);
        connection.registerPin('device1', 0);

        expect(connection.getConnections('device1', 0)).toEqual([]);
      });
    });

    describe('createConnection', () => {
      beforeEach(() => {
        connection.registerPin('device1', 0);
        connection.registerPin('device1', 1);
        connection.registerPin('device2', 0);
        connection.registerPin('device2', 1);
      });

      it('应该能创建双向连接关系', () => {
        connection.createConnection('device1', 0, 'device2', 0);

        // 检查 device1 引脚 0 连接到 device2 引脚 0
        expect(connection.getConnections('device1', 0)).toEqual([
          {
            id: 'device2',
            pin: 0,
            originPin: 0,
          },
        ]);

        // 检查 device2 引脚 0 连接到 device1 引脚 0
        expect(connection.getConnections('device2', 0)).toEqual([
          {
            id: 'device1',
            pin: 0,
            originPin: 0,
          },
        ]);
      });

      it('应该能创建多个连接', () => {
        connection.createConnection('device1', 0, 'device2', 0);
        connection.createConnection('device1', 1, 'device2', 1);

        // 检查 device1 的所有连接
        expect(connection.getConnections('device1')).toEqual([
          {
            id: 'device2',
            pin: 0,
            originPin: 0,
          },
          {
            id: 'device2',
            pin: 1,
            originPin: 1,
          },
        ]);

        // 检查 device2 的所有连接
        expect(connection.getConnections('device2')).toEqual([
          {
            id: 'device1',
            pin: 0,
            originPin: 0,
          },
          {
            id: 'device1',
            pin: 1,
            originPin: 1,
          },
        ]);
      });

      it('重复创建相同连接应该不会重复', () => {
        connection.createConnection('device1', 0, 'device2', 0);
        connection.createConnection('device1', 0, 'device2', 0);

        expect(connection.getConnections('device1', 0)).toHaveLength(1);
        expect(connection.getConnections('device2', 0)).toHaveLength(1);
      });

      it('应该能创建自连接（同一器件的不同引脚）', () => {
        connection.createConnection('device1', 0, 'device1', 1);

        expect(connection.getConnections('device1', 0)).toEqual([
          {
            id: 'device1',
            pin: 1,
            originPin: 0,
          },
        ]);

        expect(connection.getConnections('device1', 1)).toEqual([
          {
            id: 'device1',
            pin: 0,
            originPin: 1,
          },
        ]);
      });
    });

    describe('removeConnection', () => {
      beforeEach(() => {
        connection.registerPin('device1', 0);
        connection.registerPin('device1', 1);
        connection.registerPin('device2', 0);
        connection.registerPin('device2', 1);
        connection.createConnection('device1', 0, 'device2', 0);
        connection.createConnection('device1', 1, 'device2', 1);
      });

      it('应该能移除指定的连接关系', () => {
        connection.removeConnection('device1', 0, 'device2', 0);

        // device1 引脚 0 应该没有连接
        expect(connection.getConnections('device1', 0)).toEqual([]);
        // device2 引脚 0 应该没有连接
        expect(connection.getConnections('device2', 0)).toEqual([]);

        // device1 引脚 1 和 device2 引脚 1 的连接应该保持不变
        expect(connection.getConnections('device1', 1)).toEqual([
          {
            id: 'device2',
            pin: 1,
            originPin: 1,
          },
        ]);
        expect(connection.getConnections('device2', 1)).toEqual([
          {
            id: 'device1',
            pin: 1,
            originPin: 1,
          },
        ]);
      });

      it('移除不存在的连接应该不会出错', () => {
        connection.removeConnection('device1', 0, 'device2', 1);

        // 所有连接应该保持不变
        expect(connection.getConnections('device1', 0)).toEqual([
          {
            id: 'device2',
            pin: 0,
            originPin: 0,
          },
        ]);
        expect(connection.getConnections('device1', 1)).toEqual([
          {
            id: 'device2',
            pin: 1,
            originPin: 1,
          },
        ]);
      });

      it('移除连接后应该能重新创建', () => {
        connection.removeConnection('device1', 0, 'device2', 0);
        connection.createConnection('device1', 0, 'device2', 0);

        expect(connection.getConnections('device1', 0)).toEqual([
          {
            id: 'device2',
            pin: 0,
            originPin: 0,
          },
        ]);
        expect(connection.getConnections('device2', 0)).toEqual([
          {
            id: 'device1',
            pin: 0,
            originPin: 0,
          },
        ]);
      });
    });

    describe('连接管理的完整性', () => {
      it('应该能正确处理复杂的连接网络', () => {
        // 创建三个器件的连接网络
        connection.registerPin('device1', 0);
        connection.registerPin('device1', 1);
        connection.registerPin('device2', 0);
        connection.registerPin('device2', 1);
        connection.registerPin('device3', 0);

        connection.createConnection('device1', 0, 'device2', 0);
        connection.createConnection('device2', 1, 'device3', 0);
        connection.createConnection('device1', 1, 'device3', 0);

        // 验证连接网络
        expect(connection.getConnections('device1')).toEqual([
          {
            id: 'device2',
            pin: 0,
            originPin: 0,
          },
          {
            id: 'device3',
            pin: 0,
            originPin: 1,
          },
        ]);

        expect(connection.getConnections('device2')).toEqual([
          {
            id: 'device1',
            pin: 0,
            originPin: 0,
          },
          {
            id: 'device3',
            pin: 0,
            originPin: 1,
          },
        ]);

        // 验证 device3 有两个连接，但不关心顺序
        const device3Connections = connection.getConnections('device3');
        expect(device3Connections).toHaveLength(2);
        expect(device3Connections).toEqual(
          expect.arrayContaining([
            {
              id: 'device1',
              pin: 1,
              originPin: 0,
            },
            {
              id: 'device2',
              pin: 1,
              originPin: 0,
            },
          ]),
        );

        // 移除一个连接
        connection.removeConnection('device1', 0, 'device2', 0);

        // 验证其他连接保持不变
        expect(connection.getConnections('device1', 1)).toEqual([
          {
            id: 'device3',
            pin: 0,
            originPin: 1,
          },
        ]);
        expect(connection.getConnections('device2', 1)).toEqual([
          {
            id: 'device3',
            pin: 0,
            originPin: 1,
          },
        ]);
      });
    });
  });
});
