import { createServiceKey, type Watcher } from '../../context';
import type { Entity } from '../types';

/**
 * 鼠标悬停服务键
 *
 * @description 该服务用于获取鼠标悬停功能
 * @example
 * ```ts
 * const hoverService = useService(HOVER_SERVICE);
 * ```
 */
export const HOVER_SERVICE
  = createServiceKey<IHoverService>('HoverService');

/** 鼠标悬停服务 */
export interface IHoverService {
  /** 当前悬停状态 */
  status: Watcher<Entity | undefined>;
}
