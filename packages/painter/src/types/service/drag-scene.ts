import { ReadonlySet } from '@circuit/shared';
import { MouseEvent } from 'react';
import { createServiceKey } from '../../context';

/**
 * 鼠标指针服务键
 *
 * @description 该服务用于获取鼠标指针变换功能
 * @example
 * ```ts
 * const dragSceneService = useService(DRAG_SCENE_SERVICE);
 * ```
 */
export const DRAG_SCENE_SERVICE =
  createServiceKey<IDragSceneService>('DragSceneService');

/** 场景触发参数 */
export interface SceneTriggerPayload {
  /**
   * 手动触发动作时的传入参数
   *
   * @description 如果可以获得鼠标事件则传入
   */
  event?: MouseEvent;
  /**
   * 手动触发的取消参数
   *
   * @description 手动取消场景时，传入此参数
   */
  esc?: boolean;
  /** 其他参数 */
  [key: string]: any;
}

/** 鼠标拖动服务 */
export interface IDragSceneService extends ReadonlySet<string> {
  /** 正在拖动 */
  isDragging(): boolean;
  /**
   * 只有某个场景
   */
  onlyHas(scene: string): boolean;
  /**
   * 触发场景
   *
   * @description 主动触发场景
   */
  trigger(scene: string, payload?: SceneTriggerPayload): void;
  /**
   * 触发场景结束
   *
   * @description 让场景立即结束，不会等待下一次`isEnd`判断
   */
  triggerEnd(scene: string, payload?: SceneTriggerPayload): void;
}
