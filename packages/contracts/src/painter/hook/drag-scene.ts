import type { Point } from '@circuit/algorithm';
import { createServiceKey } from '@circuit/inject';

/** 拖动的鼠标事件 */
export interface DragMouseEvent extends MouseEvent {
  /**
   * 鼠标相对于元素的位置
   *
   * @description 鼠标相对`DOM`左上角的位置
   */
  readonly position: Point;
  /**
   * 鼠标相对于画布的位置
   *
   * @description 鼠标相对画布原点的位置
   */
  readonly positionInDrawer: Point;
}

/** 拖动的鼠标移动事件 */
export interface DragMoveEvent extends DragMouseEvent {
  /**
   * 鼠标拖动的移动量
   *
   * @description 鼠标本身的移动量
   */
  readonly movement: Point;
  /**
   * 鼠标拖动的移动量
   *
   * @description 鼠标在画布内的移动量
   */
  readonly movementInDrawer: Point;
  /**
   * 鼠标拖动累计移动量
   *
   * @description 相比开始拖动时，鼠标在屏幕上的总移动量
   */
  readonly movementAcc: Point;
  /**
   * 鼠标拖动累计移动量
   *
   * @description 相比开始拖动时，鼠标在画布上的总移动量
   */
  readonly movementInDrawerAcc: Point;
}

/** 钩子参数 */
export interface DragSceneHookPayload {
  /**
   * 手动触发动作时的传入事件参数
   *
   * @description 手动触发时如果传入了事件参数，这里会将其包装成画布自己的拖动事件
   */
  event?: DragMouseEvent;
  /**
   * 结束回调时是否已经移动过
   */
  isMoved?: boolean;
  /** 其他参数 */
  [key: string]: any;
}

/**
 * 拖动场景钩子
 *
 * @description 该钩子将用于鼠标拖动场景的实现
 * @example
 * ```ts
 * const dragSceneHooks = useHook(IDragSceneHook);
 * ```
 */
export const IDragSceneHook = createServiceKey<IDragSceneHook>('IDragSceneHook');

/** 鼠标拖动场景 */
export interface IDragSceneHook {
  /** 场景类型 */
  name: string;
  /**
   * 场景开始
   *
   * @description 首次移动之前
   */
  afterStart?(startPayload?: DragSceneHookPayload): void;
  /**
   * 首次拖拽执行
   *
   * @description `payload`为场景触发时传递的参数
   * @description 此项回调设定时，首次拖拽执行时会调用此回调，否则将会调用`onDragMove`
   */
  onFirstDragMove?(event: DragMoveEvent, payload: DragSceneHookPayload): void;
  /**
   * 拖拽执行中
   *
   * @description `payload`为场景触发时传递的参数
   */
  onDragMove(event: DragMoveEvent, payload: DragSceneHookPayload): void;
  /**
   * 场景结束前
   */
  beforeEnd?(startPayload?: DragSceneHookPayload, endPayload?: DragSceneHookPayload): void;
  /**
   * 场景结束
   */
  afterEnd?(startPayload?: DragSceneHookPayload, endPayload?: DragSceneHookPayload): void;
  /**
   * 取消场景前
   */
  beforeCancel?(startPayload?: DragSceneHookPayload, endPayload?: DragSceneHookPayload): void;
  /**
   * 取消场景
   */
  afterCancel?(startPayload?: DragSceneHookPayload, endPayload?: DragSceneHookPayload): void;
}
