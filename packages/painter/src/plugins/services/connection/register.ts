import { StructuredData } from '@circuit/types';
import { definePlugin } from '../../../context';
import {
  CONNECTION_SERVICE,
  type IConnectionService,
  type IConnectionData,
  type IConnectionDataWithPin,
} from '../../../types';
import { IConnectionMap } from './types';
import { getConnections } from './utils';

definePlugin(({ registerService }) => {
  const connections: IConnectionMap = new Map();
  const findConnectionIndex = (connections: IConnectionData[], target: IConnectionData): number => {
    return connections.findIndex(conn => conn.id === target.id && conn.pin === target.pin);
  };

  const service: IConnectionService = {
    createConnectionFromData(data: StructuredData) {
      this.clearAll();

      // 获取所有连接
      const connectionsList = getConnections(data);
      // 设定所有连接
      for (const connections of connectionsList) {
        // 没有连接
        if (connections.length === 0) {
          continue;
        }

        // 注册连接
        for (const connection of connections) {
          this.registerPin(connection.id, connection.pin);
        }

        // 相互建立连接关系
        for (const connection of connections) {
          for (const other of connections) {
            if (connection.id === other.id) {
              continue;
            }

            this.createConnection(connection.id, connection.pin, other.id, other.pin);
          }
        }
      }
    },
    registerPin(deviceId: string, pin: number) {
      if (!connections.has(deviceId)) {
        connections.set(deviceId, new Map());
      }
      const deviceConnections = connections.get(deviceId)!;
      if (!deviceConnections.has(pin)) {
        deviceConnections.set(pin, []);
      }
    },
    clearAll() {
      connections.clear();
    },
    removeDevice(deviceId: string, pin?: number) {
      if (!connections.has(deviceId)) {
        return;
      }

      const deviceConnections = connections.get(deviceId)!;

      // 移除指定引脚的所有连接
      if (pin !== undefined) {
        const pinConnections = deviceConnections.get(pin);
        if (pinConnections) {
          // 复制一份连接数组，因为我们在遍历过程中会修改它
          [...pinConnections].forEach(target => {
            this.removeConnection(deviceId, pin, target.id, target.pin);
          });
          deviceConnections.delete(pin);
        }
      }
      // 移除设备的所有引脚连接
      else {
        deviceConnections.forEach((pinConnections, pin) => {
          // 复制一份连接数组，因为我们在遍历过程中会修改它
          [...pinConnections].forEach(target => {
            this.removeConnection(deviceId, pin, target.id, target.pin);
          });
        });
        connections.delete(deviceId);
      }
    },
    getConnections(id: string, pin?: number): IConnectionDataWithPin[] {
      const deviceConnections = connections.get(id);

      if (!deviceConnections) {
        return [];
      }

      if (pin !== undefined) {
        const pinConnections = deviceConnections.get(pin);
        return (pinConnections ? [...pinConnections] : []).map(connection => ({
          ...connection,
          originPin: pin,
        }));
      }

      // 返回所有引脚的连接
      const allConnections: IConnectionDataWithPin[] = [];

      for (const key of deviceConnections.keys()) {
        const pinConnections = deviceConnections.get(key);
        if (pinConnections) {
          allConnections.push(...pinConnections.map(connection => ({
            ...connection,
            originPin: key,
          })));
        }
      }

      return allConnections;
    },
    createConnection(id: string, pin: number, targetId: string, targetPin: number) {
      // 确保源引脚存在
      this.registerPin(id, pin);
      // 确保目标引脚存在
      this.registerPin(targetId, targetPin);

      const sourceConnections = connections.get(id)!.get(pin)!;
      const targetConnections = connections.get(targetId)!.get(targetPin)!;
      const sourceTarget = { id: targetId, pin: targetPin };
      const targetSource = { id, pin };

      if (findConnectionIndex(sourceConnections, sourceTarget) === -1) {
        sourceConnections.push(sourceTarget);
      }
      if (findConnectionIndex(targetConnections, targetSource) === -1) {
        targetConnections.push(targetSource);
      }
    },
    removeConnection(id: string, pin: number, targetId: string, targetPin: number) {
      // 移除源引脚连接
      const deviceConnections = connections.get(id);
      if (deviceConnections) {
        const pinConnections = deviceConnections.get(pin);
        if (pinConnections) {
          const sourceTarget = { id: targetId, pin: targetPin };
          const sourceIndex = findConnectionIndex(pinConnections, sourceTarget);
          if (sourceIndex !== -1) {
            pinConnections.splice(sourceIndex, 1);
          }
        }
      }

      // 移除目标引脚连接
      const targetDevice = connections.get(targetId);
      if (targetDevice) {
        const targetPinConnection = targetDevice.get(targetPin);
        if (targetPinConnection) {
          const targetSource = { id, pin };
          const targetIndex = findConnectionIndex(targetPinConnection, targetSource);
          if (targetIndex !== -1) {
            targetPinConnection.splice(targetIndex, 1);
          }
        }
      }
    },
    changeDeviceId(id: string, newId: string) {
      // 如果新旧编号相同，无需处理
      if (id === newId) {
        return;
      }

      const deviceConnections = connections.get(id);

      if (!deviceConnections) {
        return;
      }

      // 更新连接
      connections.set(newId, deviceConnections);
      // 删除旧数据
      connections.delete(id);

      // 遍历更新被连接器件的连接
      for (const [originPin, pinConnections] of deviceConnections.entries()) {
        for (const { id: targetId, pin: targetPin } of pinConnections) {
          this.removeConnection(targetId, targetPin, id, originPin);
          this.createConnection(targetId, targetPin, newId, originPin);
        }
      }
    },
  };

  // 注册服务
  registerService(CONNECTION_SERVICE, service);

  // 卸载器
  return () => {
    service.clearAll();
  };
});
