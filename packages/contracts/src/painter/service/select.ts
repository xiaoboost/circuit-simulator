import { createServiceKey } from '@circuit/inject';
import type { Watcher } from '@circuit/reactive';

/**
 * 选中服务键
 *
 * @description 该服务用于获取当前画布选中的内容
 * @example
 * ```ts
 * const selectService = useService(ISelectService);
 * ```
 */
export const ISelectService
  = createServiceKey<ISelectService>('SelectService');

/** 选中服务 */
export interface ISelectService {
  /** 选中内容 */
  readonly value: Watcher<Set<string>>;
  /** 未选中任何内容 */
  isEmpty(): boolean;
  /** 设置选中内容 */
  set(...ids: string[]): void;
  /** 添加选中内容 */
  add(...ids: string[]): void;
  /** 清空选中内容 */
  clear(): void;
}
