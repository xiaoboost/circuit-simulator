import { MouseEvent } from 'react';

/** 鼠标拖动场景 */
export interface DragScene {
  /** 钩子名称 */
  kind: 'DragScene';
  /** 场景类型 */
  name: string;
  /**
   * 场景触发
   *
   * @description 所有鼠标事件都会注入这里，当返回`true`时，表示该场景触发
   */
  start(event: MouseEvent): boolean | undefined;
  /**
   * 场景结束
   *
   * @description 所有鼠标事件都会注入这里，当返回`true`时，表示该场景结束
   */
  isEnd(event: MouseEvent): boolean | undefined;
  /**
   * 拖拽执行中
   */
  onDragMove(event: MouseEvent): void;
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
