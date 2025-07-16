import { createServiceKey } from '@circuit/inject';
import type { EventStream } from '@circuit/reactive';

/**
 * 事件流服务
 *
 * @description 该服务提供了事件流服务
 * @example
 * ```ts
 * const streamService = useService(STREAM_SERVICE);
 * ```
 */
export const STREAM_SERVICE =
  createServiceKey<IStreamService>('StreamService');

export interface IStreamService {
  /** 获取或者创建流 */
  getOrCreateStream<T = void>(key: symbol): EventStream<T>;
  /** 清除所有流 */
  clear(): void;
}
