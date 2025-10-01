import { createServiceKey } from '../../context';

/**
 * 事件监听钩子
 *
 * @description 该钩子将用于监听原始 DOM 事件
 * @example
 * ```ts
 * const eventListenerHooks = useHook(IEventListenerHook);
 * ```
 */
export const IEventListenerHook = createServiceKey<IEventListenerHook>('IEventListenerHook');

/** 原生事件监听 */
export interface IEventListenerHook {
  /**
   * 事件监听的顺序
   *
   * @description 数字越小，优先级越高
   * @default 0
   */
  order?: number;
  /**
   * 是否为被动事件
   *
   * @description 被动事件不会阻止默认行为
   * @default false
   */
  passive?: boolean;
  /**
   * 是否为捕获事件
   *
   * @description 捕获事件会阻止默认行为
   * @default false
   */
  capture?: boolean;

  /** 左键点击事件 */
  onClick?(event: MouseEvent): void;
  /** 右键点击事件 */
  onRightClick?(event: MouseEvent): void;
  /** 双击事件 */
  onDblClick?(event: MouseEvent): void;
  /** 鼠标按下事件 */
  onMouseDown?(event: MouseEvent): void;
  /** 鼠标抬起事件 */
  onMouseUp?(event: MouseEvent): void;
  /** 鼠标移动事件 */
  onMouseMove?(event: MouseEvent): void;
  /** 鼠标进入事件 */
  onMouseEnter?(event: MouseEvent): void;
  /** 鼠标离开事件 */
  onMouseLeave?(event: MouseEvent): void;
  /** 鼠标滚轮事件 */
  onWheel?(event: WheelEvent): void;
}
