import { MouseEvent, WheelEvent } from 'react';

/** 事件监听 */
export interface EventListener {
  /** 钩子类别 */
  kind: 'EventListener';
  /** 点击事件 */
  onClick?(event: MouseEvent): void;
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
  onMouseWheel?(event: WheelEvent): void;
}
