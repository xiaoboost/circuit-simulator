import { createServiceKey } from '@circuit/inject';

/**
 * 缓存服务
 *
 * @description 该服务提供了缓存服务
 * @example
 * ```ts
 * const cacheService = useService(CACHE_SERVICE);
 * ```
 */
export const CACHE_SERVICE =
  createServiceKey<ICacheService>('CacheService');

export interface ICacheService {
  /** 设置缓存 */
  set(name: string, data: object): Promise<void>;
  /** 获取缓存 */
  get<T = any>(name: string): Promise<T | undefined>;
}
