import type { Point } from '@circuit/math';
import type { MouseEvent } from 'react';
import { createServiceKey } from '../../context';

/** 拖动的鼠标事件 */
export interface DragMouseEvent extends MouseEvent<HTMLElement> {
  /** 鼠标当前相对于图纸位置 */
  readonly position: Point;
}

/** 拖动的鼠标移动事件 */
export interface DragMoveEvent extends DragMouseEvent {
  /** 鼠标拖动的移动向量 */
  readonly movement: Point;
}

/**
 * 拖动场景钩子
 *
 * @description 该钩子将用于鼠标拖动场景的实现
 * @example
 * ```ts
 * const dragSceneHooks = usePainterHook(DRAG_SCENE_HOOK);
 * ```
 */
export const DRAG_SCENE_HOOK = createServiceKey<IDragScene>('DragScene');

/** 鼠标拖动场景 */
export interface IDragScene {
  /** 场景类型 */
  name: string;
  /**
   * 场景触发
   *
   * @description 所有鼠标事件都会注入这里，当返回`true`时，表示该场景触发
   */
  start(event: DragMouseEvent): boolean | undefined;
  /**
   * 场景结束
   *
   * @description 所有鼠标事件都会注入这里，当返回`true`时，表示该场景结束
   */
  isEnd(event: DragMouseEvent): boolean | undefined;
  /**
   * 拖拽执行中
   */
  onDragMove(event: DragMoveEvent): void;
  /**
   * 场景开始
   *
   * @description 首次移动之前
   */
  afterStart?(): void;
  /**
   * 场景结束
   */
  afterEnd?(): void;
}
