import { ElectronicsStructuredData } from '@circuit/electronics';
import { createServiceKey } from '../../context';

/**
 * 连接关系服务
 *
 * @description 该服务用于获取连接关系服务
 * @example
 * ```ts
 * const connectionService = usePainterService(CONNECTION_SERVICE);
 * ```
 */
export const CONNECTION_SERVICE =
  createServiceKey<IConnectionService>('ConnectionService');

export interface IConnectionData {
  /** 元件编号 */
  id: string;
  /** 引脚编号 */
  index: number;
}

/** 引脚连接关系 */
export interface IPinConnection extends IConnectionData {
  /** 连接关系 */
  connections: IConnectionData;
}

export interface IConnectionService {
  /**
   * 从原始数据创建连接关系
   */
  createConnectionFromData(data: ElectronicsStructuredData): void;

  /**
   * 注册引脚
   */
  registerPin(deviceId: string, pin: number): void;

  /** 清除所有数据 */
  clearAll(): void;

  /**
   * 移除元件
   *
   * @description 不输入`pin`时将会移除其下所有引脚数据
   * @description 双向连接均会被移除
   */
  removeDevice(deviceId: string, pin?: number): void;

  /**
   * 获取元件连接数据
   *
   * @description 不输入`pin`时将会拿到所有连接
   */
  getConnections(id: string, pin?: number): IConnectionData[];

  /**
   * 添加连接
   */
  createConnection(id: string, pin: number, targetId: string, targetPin: number): void;

  /**
   * 移除连接
   */
  removeConnection(id: string, pin: number, targetId: string, targetPin: number): void;
}

