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

      it('应该能创建器件自连接（同一器件的不同引脚）', () => {
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

      it('应该排除引脚自连接', () => {
        // 尝试创建引脚自连接
        connection.createConnection('device1', 0, 'device1', 0);

        // 验证没有创建任何连接
        expect(connection.getConnections('device1', 0)).toEqual([]);
      });

      it('排除引脚自连接时不应该触发观察者通知', () => {
        let observerCalled = false;
        const unsubscribe = connection.observe('device1', () => {
          observerCalled = true;
        });

        // 注册引脚
        connection.registerPin('device1', 0);

        // 尝试创建引脚自连接
        connection.createConnection('device1', 0, 'device1', 0);

        // 验证观察者没有被调用
        expect(observerCalled).toBe(false);

        unsubscribe();
      });
    });

    describe('createConnections', () => {
      beforeEach(() => {
        connection.registerPin('device1', 0);
        connection.registerPin('device1', 1);
        connection.registerPin('device2', 0);
        connection.registerPin('device2', 1);
        connection.registerPin('device3', 0);
        connection.registerPin('device3', 1);
      });

      it('应该能批量创建多个连接', () => {
        const targets = [
          { id: 'device2', pin: 0 },
          { id: 'device3', pin: 0 },
        ];

        connection.createConnections('device1', 0, targets);

        // 检查 device1 引脚 0 连接到多个设备
        expect(connection.getConnections('device1', 0)).toEqual([
          {
            id: 'device2',
            pin: 0,
            originPin: 0,
          },
          {
            id: 'device3',
            pin: 0,
            originPin: 0,
          },
        ]);

        // 检查反向连接
        expect(connection.getConnections('device2', 0)).toEqual([
          {
            id: 'device1',
            pin: 0,
            originPin: 0,
          },
        ]);
        expect(connection.getConnections('device3', 0)).toEqual([
          {
            id: 'device1',
            pin: 0,
            originPin: 0,
          },
        ]);
      });

      it('应该能处理空目标数组', () => {
        connection.createConnections('device1', 0, []);

        expect(connection.getConnections('device1', 0)).toEqual([]);
      });

      it('应该能处理包含重复目标的数组', () => {
        const targets = [
          { id: 'device2', pin: 0 },
          { id: 'device2', pin: 0 }, // 重复
          { id: 'device3', pin: 0 },
        ];

        connection.createConnections('device1', 0, targets);

        // 重复的连接应该被去重
        expect(connection.getConnections('device1', 0)).toEqual([
          {
            id: 'device2',
            pin: 0,
            originPin: 0,
          },
          {
            id: 'device3',
            pin: 0,
            originPin: 0,
          },
        ]);
      });

      it('应该能处理包含自连接的目标数组', () => {
        const targets = [
          { id: 'device1', pin: 1 }, // 自连接
          { id: 'device2', pin: 0 },
        ];

        connection.createConnections('device1', 0, targets);

        expect(connection.getConnections('device1', 0)).toEqual([
          {
            id: 'device1',
            pin: 1,
            originPin: 0,
          },
          {
            id: 'device2',
            pin: 0,
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

      it('应该能处理复杂的目标数组', () => {
        const targets = [
          { id: 'device2', pin: 0 },
          { id: 'device2', pin: 1 },
          { id: 'device3', pin: 0 },
          { id: 'device3', pin: 1 },
        ];

        connection.createConnections('device1', 0, targets);

        // 验证 device1 引脚 0 的所有连接
        const device1Connections = connection.getConnections('device1', 0);
        expect(device1Connections).toHaveLength(4);
        expect(device1Connections).toEqual(
          expect.arrayContaining([
            { id: 'device2', pin: 0, originPin: 0 },
            { id: 'device2', pin: 1, originPin: 0 },
            { id: 'device3', pin: 0, originPin: 0 },
            { id: 'device3', pin: 1, originPin: 0 },
          ]),
        );

        // 验证反向连接
        expect(connection.getConnections('device2', 0)).toEqual([{ id: 'device1', pin: 0, originPin: 0 }]);
        expect(connection.getConnections('device2', 1)).toEqual([{ id: 'device1', pin: 0, originPin: 1 }]);
        expect(connection.getConnections('device3', 0)).toEqual([{ id: 'device1', pin: 0, originPin: 0 }]);
        expect(connection.getConnections('device3', 1)).toEqual([{ id: 'device1', pin: 0, originPin: 1 }]);
      });

      it('应该能与其他连接方法配合使用', () => {
        // 先创建一些连接
        connection.createConnection('device1', 1, 'device2', 1);

        // 使用 createConnections 创建更多连接
        const targets = [
          { id: 'device2', pin: 0 },
          { id: 'device3', pin: 0 },
        ];
        connection.createConnections('device1', 0, targets);

        // 验证所有连接都正确建立
        expect(connection.getConnections('device1')).toEqual([
          { id: 'device2', pin: 0, originPin: 0 },
          { id: 'device3', pin: 0, originPin: 0 },
          { id: 'device2', pin: 1, originPin: 1 },
        ]);

        expect(connection.getConnections('device2')).toEqual([
          { id: 'device1', pin: 0, originPin: 0 },
          { id: 'device1', pin: 1, originPin: 1 },
        ]);

        expect(connection.getConnections('device3')).toEqual([{ id: 'device1', pin: 0, originPin: 0 }]);
      });

      it('应该排除目标数组中的引脚自连接', () => {
        const targets = [
          { id: 'device1', pin: 0 }, // 引脚自连接，应该被排除
          { id: 'device2', pin: 0 },
          { id: 'device3', pin: 0 },
        ];

        connection.createConnections('device1', 0, targets);

        // 验证只创建了有效的连接，排除了引脚自连接
        expect(connection.getConnections('device1', 0)).toEqual([
          { id: 'device2', pin: 0, originPin: 0 },
          { id: 'device3', pin: 0, originPin: 0 },
        ]);

        // 验证反向连接
        expect(connection.getConnections('device2', 0)).toEqual([{ id: 'device1', pin: 0, originPin: 0 }]);
        expect(connection.getConnections('device3', 0)).toEqual([{ id: 'device1', pin: 0, originPin: 0 }]);
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

    describe('swapConnections', () => {
      beforeEach(() => {
        connection.registerPin('device1', 0);
        connection.registerPin('device1', 1);
        connection.registerPin('device2', 0);
        connection.registerPin('device2', 1);
        connection.registerPin('device3', 0);
        connection.registerPin('device3', 1);
      });

      it('应该能交换两个引脚的所有连接', () => {
        // 建立初始连接
        connection.createConnection('device1', 0, 'device2', 0);
        connection.createConnection('device1', 0, 'device3', 0);
        connection.createConnection('device1', 1, 'device2', 1);

        // 验证初始状态
        expect(connection.getConnections('device1', 0)).toEqual([{ id: 'device2', pin: 0, originPin: 0 }, { id: 'device3', pin: 0, originPin: 0 }]);
        expect(connection.getConnections('device1', 1)).toEqual([{ id: 'device2', pin: 1, originPin: 1 }]);

        // 交换 device1 的引脚 0 和 1
        connection.swapConnections('device1', 0, 'device1', 1);

        // 验证交换后的状态
        expect(connection.getConnections('device1', 0)).toEqual([{ id: 'device2', pin: 1, originPin: 0 }]);
        expect(connection.getConnections('device1', 1)).toEqual([{ id: 'device2', pin: 0, originPin: 1 }, { id: 'device3', pin: 0, originPin: 1 }]);

        // 验证其他设备的连接也相应更新
        expect(connection.getConnections('device2', 0)).toEqual([{ id: 'device1', pin: 1, originPin: 0 }]);
        expect(connection.getConnections('device2', 1)).toEqual([{ id: 'device1', pin: 0, originPin: 1 }]);
        expect(connection.getConnections('device3', 0)).toEqual([{ id: 'device1', pin: 1, originPin: 0 }]);
      });

      it('应该能交换不同器件的引脚连接', () => {
        // 建立初始连接
        connection.createConnection('device1', 0, 'device3', 0);
        connection.createConnection('device1', 1, 'device3', 1);
        connection.createConnection('device2', 0, 'device3', 0);

        // 交换 device1 引脚 0 和 device2 引脚 0
        connection.swapConnections('device1', 0, 'device2', 0);

        // 验证交换后的状态
        expect(connection.getConnections('device1', 0)).toEqual([{ id: 'device3', pin: 0, originPin: 0 }]);
        expect(connection.getConnections('device2', 0)).toEqual([{ id: 'device3', pin: 0, originPin: 0 }]);
        expect(connection.getConnections('device1', 1)).toEqual([{ id: 'device3', pin: 1, originPin: 1 }]);

        // 验证 device3 的连接更新
        const device3Connections = connection.getConnections('device3');
        expect(device3Connections).toHaveLength(3);
        expect(device3Connections).toEqual(
          expect.arrayContaining([
            { id: 'device1', pin: 0, originPin: 0 },
            { id: 'device2', pin: 0, originPin: 0 },
            { id: 'device1', pin: 1, originPin: 1 },
          ]),
        );
      });

      it('交换空引脚应该不会出错', () => {
        // device1 引脚 0 和 device2 引脚 0 都没有连接
        expect(connection.getConnections('device1', 0)).toEqual([]);
        expect(connection.getConnections('device2', 0)).toEqual([]);

        // 交换空引脚
        connection.swapConnections('device1', 0, 'device2', 0);

        // 验证交换后仍然为空
        expect(connection.getConnections('device1', 0)).toEqual([]);
        expect(connection.getConnections('device2', 0)).toEqual([]);
      });

      it('交换一个空引脚和一个有连接的引脚', () => {
        // device1 引脚 0 有连接，device2 引脚 0 没有连接
        connection.createConnection('device1', 0, 'device3', 0);

        // 交换
        connection.swapConnections('device1', 0, 'device2', 0);

        // 验证 device1 引脚 0 现在没有连接
        expect(connection.getConnections('device1', 0)).toEqual([]);
        // 验证 device2 引脚 0 现在有连接
        expect(connection.getConnections('device2', 0)).toEqual([{ id: 'device3', pin: 0, originPin: 0 }]);
        // 验证 device3 的连接更新
        expect(connection.getConnections('device3', 0)).toEqual([{ id: 'device2', pin: 0, originPin: 0 }]);
      });

      it('应该能正确处理自连接的情况', () => {
        // 创建自连接
        connection.createConnection('device1', 0, 'device1', 1);

        // 交换引脚
        connection.swapConnections('device1', 0, 'device1', 1);

        // 验证自连接仍然存在
        expect(connection.getConnections('device1', 0)).toEqual([{ id: 'device1', pin: 1, originPin: 0 }]);
        expect(connection.getConnections('device1', 1)).toEqual([{ id: 'device1', pin: 0, originPin: 1 }]);
      });

      it('交换后应该保持双向连接的完整性', () => {
        // 建立复杂连接网络
        connection.createConnection('device1', 0, 'device2', 0);
        connection.createConnection('device1', 0, 'device3', 0);
        connection.createConnection('device2', 1, 'device3', 1);

        // 交换 device1 引脚 0 和 device2 引脚 1
        connection.swapConnections('device1', 0, 'device2', 1);

        // 验证所有双向连接都正确更新
        expect(connection.getConnections('device1', 0)).toEqual([{ id: 'device3', pin: 1, originPin: 0 }]);
        expect(connection.getConnections('device2', 1)).toEqual([{ id: 'device2', pin: 0, originPin: 1 }, { id: 'device3', pin: 0, originPin: 1 }]);

        // 验证反向连接
        expect(connection.getConnections('device2', 0)).toEqual([{ id: 'device2', pin: 1, originPin: 0 }]);
        expect(connection.getConnections('device3', 0)).toEqual([{ id: 'device2', pin: 1, originPin: 0 }]);
        expect(connection.getConnections('device3', 1)).toEqual([{ id: 'device1', pin: 0, originPin: 1 }]);
      });
    });
  });
});
