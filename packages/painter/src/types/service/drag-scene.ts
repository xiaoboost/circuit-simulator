import { ReadonlySet } from '@circuit/shared';
import { createServiceKey } from '../../context';

/**
 * 鼠标指针服务键
 *
 * @description 该服务用于获取鼠标指针变换功能
 * @example
 * ```ts
 * const dragSceneService = usePainterService(DRAG_SCENE_SERVICE);
 * ```
 */
export const DRAG_SCENE_SERVICE =
  createServiceKey<IDragSceneService>('DragSceneService');

/** 鼠标拖动服务 */
export interface IDragSceneService extends ReadonlySet<string> {
  /**
   * 触发场景
   *
   * @description 主动触发场景
   */
  trigger(scene: string, payload: any): void;
}
