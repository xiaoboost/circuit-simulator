import { createServiceKey, Watcher } from '../../context';

/**
 * 选中服务键
 *
 * @description 该服务用于获取当前画布选中的内容
 * @example
 * ```ts
 * const selectService = useService(SELECT_SERVICE);
 * ```
 */
export const SELECT_SERVICE
  = createServiceKey<ISelectService>('SelectService');

/** 选中服务 */
export interface ISelectService {
  /** 选中内容 */
  readonly value: Watcher<Set<string>>;
  /** 设置选中内容 */
  set(...ids: string[]): void;
  /** 清空选中内容 */
  clear(): void;
}
