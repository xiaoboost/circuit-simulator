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

/** 场景触发参数 */
export interface ScenePayload {
  /** 其他参数 */
  [key: string]: any;
}

/** 鼠标拖动服务 */
export interface IDragSceneService extends ReadonlySet<string> {
  /**
   * 触发场景
   *
   * @description 主动触发场景
   */
  trigger(scene: string, startPayload?: ScenePayload): void;
  /**
   * 触发场景结束
   *
   * @description 让场景立即结束，不会等待下一次`isEnd`判断
   */
  triggerEnd(scene: string, endPayload?: ScenePayload): void;
  /**
   * 只有某个场景
   */
  onlyHas(scene: string): boolean;
}
