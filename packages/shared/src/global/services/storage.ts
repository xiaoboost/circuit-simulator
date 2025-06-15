import { createServiceKey } from '@circuit/inject';

/**
 * 储存服务
 *
 * @description 该服务提供了储存服务
 * @example
 * ```ts
 * const cacheService = useService(CACHE_SERVICE);
 * ```
 */
export const STORAGE_SERVICE =
  createServiceKey<IStorageService>('StorageService');

export interface IStorageService {
  /** 设置储存 */
  set(name: string, data: any): Promise<void>;
  /** 获取储存 */
  get<T = any>(name: string): Promise<T | undefined>;
  /** 删除储存 */
  remove(name: string): Promise<void>;
  /** 清空储存 */
  clear(): Promise<void>;
}
