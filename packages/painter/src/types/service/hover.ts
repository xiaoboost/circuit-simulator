import { createServiceKey, type Watcher } from '../../context';
import type { Entity } from '../types';

/**
 * 鼠标悬停服务键
 *
 * @description 该服务用于获取鼠标悬停功能
 * @example
 * ```ts
 * const hoverService = useService(IHoverService);
 * ```
 */
export const IHoverService
  = createServiceKey<IHoverService>('HoverService');

/** 鼠标悬停服务 */
export interface IHoverService {
  /** 当前悬停状态 */
  status: Watcher<Entity | undefined>;
  /**
   * 立即更新悬停状态
   *
   * @description 通常在画布变更而鼠标没有活动的时候调用
   */
  update(): void;
}
