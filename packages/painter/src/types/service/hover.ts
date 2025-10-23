import type { Point } from '@circuit/algorithm';
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
  /** 当前悬停的实体 */
  current: Watcher<Entity | undefined>;
  /**
   * 更新当前悬停的实体
   *
   * @description 通常在画布变更而鼠标没有活动的时候调用
   */
  updateCurrent(): void;
  /**
   * 获取指定位置从上到下堆叠的所有实体
   *
   * @param position 要查询的位置，不传则使用当前鼠标位置
   * @returns 按优先级排序的实体列表（优先级高的在前）
   */
  getStackAt(position?: Point): Entity[];
}
