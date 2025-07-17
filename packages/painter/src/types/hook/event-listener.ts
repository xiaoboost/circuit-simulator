import type { MouseEvent, WheelEvent } from 'react';
import { createServiceKey } from '../../context';

/**
 * 事件监听钩子
 *
 * @description 该钩子将用于监听原始 DOM 事件
 * @example
 * ```ts
 * const eventListenerHooks = useHook(EVENT_LISTENER_HOOK);
 * ```
 */
export const EVENT_LISTENER_HOOK = createServiceKey<IEventListener>('EventListener');

/** 事件监听 */
export interface IEventListener {
  /**
   * 事件监听的顺序
   *
   * @description 数字越小，优先级越高
   * @default 0
   */
  order?: number;

  /** 点击事件 */
  onClick?(event: MouseEvent<HTMLElement>): void;
  /** 双击事件 */
  onDblClick?(event: MouseEvent<HTMLElement>): void;
  /** 鼠标按下事件 */
  onMouseDown?(event: MouseEvent<HTMLElement>): void;
  /** 鼠标抬起事件 */
  onMouseUp?(event: MouseEvent<HTMLElement>): void;
  /** 鼠标移动事件 */
  onMouseMove?(event: MouseEvent<HTMLElement>): void;
  /** 鼠标进入事件 */
  onMouseEnter?(event: MouseEvent<HTMLElement>): void;
  /** 鼠标离开事件 */
  onMouseLeave?(event: MouseEvent<HTMLElement>): void;
  /** 鼠标滚轮事件 */
  onMouseWheel?(event: WheelEvent<HTMLElement>): void;
}
