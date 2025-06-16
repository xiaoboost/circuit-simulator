import { StructuredData } from '@circuit/types';
import { definePlugin } from '../../../context';
import {
  CONNECTION_SERVICE,
  IConnectionService,
  IConnectionData,
} from '../../../types';
import { IConnectionMap } from './types';
import { getConnections } from './utils';

definePlugin(({ registerService }) => {
  const connections: IConnectionMap = new Map();
  const findConnectionIndex = (connections: IConnectionData[], target: IConnectionData): number => {
    return connections.findIndex(conn => conn.id === target.id && conn.index === target.index);
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
          this.registerPin(connection.id, connection.index);
        }

        // 相互建立连接关系
        for (const connection of connections) {
          for (const other of connections) {
            if (connection.id === other.id) {
              continue;
            }

            this.createConnection(connection.id, connection.index, other.id, other.index);
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
            this.removeConnection(deviceId, pin, target.id, target.index);
          });
          deviceConnections.delete(pin);
        }
      }
      // 移除设备的所有引脚连接
      else {
        deviceConnections.forEach((pinConnections, pin) => {
          // 复制一份连接数组，因为我们在遍历过程中会修改它
          [...pinConnections].forEach(target => {
            this.removeConnection(deviceId, pin, target.id, target.index);
          });
        });
        connections.delete(deviceId);
      }
    },
    getConnections(id: string, pin?: number): IConnectionData[] {
      const deviceConnections = connections.get(id);

      if (!deviceConnections) {
        return [];
      }

      if (pin !== undefined) {
        const pinConnections = deviceConnections.get(pin);
        return pinConnections ? [...pinConnections] : [];
      }

      // 返回所有引脚的连接
      const allConnections: IConnectionData[] = [];
      deviceConnections.forEach(pinConnections => {
        allConnections.push(...pinConnections);
      });
      return allConnections;
    },
    createConnection(id: string, pin: number, targetId: string, targetPin: number) {
      // 确保源引脚存在
      this.registerPin(id, pin);
      // 确保目标引脚存在
      this.registerPin(targetId, targetPin);

      const sourceConnections = connections.get(id)!.get(pin)!;
      const targetConnections = connections.get(targetId)!.get(targetPin)!;
      const sourceTarget = { id: targetId, index: targetPin };
      const targetSource = { id, index: pin };

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
          const sourceTarget = { id: targetId, index: targetPin };
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
          const targetSource = { id, index: pin };
          const targetIndex = findConnectionIndex(targetPinConnection, targetSource);
          if (targetIndex !== -1) {
            targetPinConnection.splice(targetIndex, 1);
          }
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
