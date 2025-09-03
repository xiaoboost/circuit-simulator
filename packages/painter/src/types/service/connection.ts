import { createServiceKey } from '@circuit/inject';
import type { StructuredData } from '@circuit/types';
import type { ObserverCb } from './variable-observer';

/**
 * 连接关系服务
 *
 * @description 该服务用于获取连接关系服务
 * @example
 * ```ts
 * const connectionService = useService(CONNECTION_SERVICE);
 * ```
 */
export const CONNECTION_SERVICE
  = createServiceKey<IConnectionService>('ConnectionService');

/** 连接数据 */
export interface IConnectionData {
  /** 元件编号 */
  id: string;
  /** 引脚编号 */
  pin: number;
}

/** 连接数据 */
export interface IConnectionDataWithPin extends IConnectionData {
  /** 当前引脚 */
  originPin: number;
}

/** 引脚连接关系 */
export interface IPinConnection extends IConnectionData {
  /** 连接关系 */
  connections: IConnectionData;
}

export interface IConnectionService {
  // ========== 核心接口 ==========
  /**
   * 注册引脚
   */
  registerPin(deviceId: string, pin: number): void;

  /**
   * 清除所有数据
   */
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
  getConnections(id: string, pin?: number): IConnectionDataWithPin[];

  /**
   * 添加连接
   *
   * @description 创建双向连接关系
   * @description 这里会确保源引脚和目标引脚存在
   */
  createConnection(id: string, pin: number, targetId: string, targetPin: number): void;

  /**
   * 移除连接
   *
   * @description 移除双向连接关系
   */
  removeConnection(id: string, pin: number, targetId: string, targetPin: number): void;

  // ========== 业务接口 ==========
  /**
   * 元件引脚是否为空
   */
  isEmptyPin(id: string, pin: number): boolean;

  /**
   * 从原始数据创建连接关系
   */
  createFromData(data: StructuredData): void;

  // ========== 发布订阅 ==========
  /**
   * 监听元件引脚连接关系
   */
  observe(id: string, callback: ObserverCb<IConnectionDataWithPin[]>): () => void;

  /**
   * 取消所有观察
   */
  unObserve(): void;
  /**
   * 取消观察器件
   */
  unObserve(id: string): void;
  /**
   * 取消观察回调
   */
  unObserve(id: string, callback: ObserverCb<IConnectionDataWithPin[]>): void;

  /**
   * React 订阅元件连接数据
   */
  useDeviceConnections(id: string): IConnectionDataWithPin[];
}
