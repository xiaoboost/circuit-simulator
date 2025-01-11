import type { Point } from '@circuit/math';
import type { MouseButtons } from '@xiao-ai/utils/web';

export type Callback = (event: DrawMouseEvent) => any;
export type StopEventInput = StopEventOption | ((event?: DrawMouseEvent) => Promise<void>);
export type ClassNameEventInput = string | ((event?: DrawMouseEvent) => string);

/** 鼠标结束事件配置 */
export interface StopEventOption {
  type: 'click' | 'dblclick' | 'mousedown' | 'mouseup';
  which: keyof typeof MouseButtons;
}

/** 基础事件 */
export interface DrawBaseEvent {
  readonly target: HTMLElement;
  readonly currentTarget: HTMLElement;
  readonly origin: MouseEvent;
}

/** 绘图事件 */
export interface DrawMouseMoveEvent extends DrawBaseEvent {
  /** 鼠标移动向量 */
  readonly movement: Point;
  /** 鼠标坐标 */
  readonly position: Point;
}

/** 鼠标进入或离开事件 */
export interface DrawMouseEnterOrLeaveEvent extends DrawBaseEvent {
  /** 进入或离开的器件编号 */
  readonly id: string;
}

/** 事件保存数据 */
export interface DrawEventData {
  type: 'mousemove' | 'mouseenter' | 'mouseleave';
  selector: string;
  callback(ev: DrawMouseEvent): any;
}

/** 鼠标事件 */
export type DrawMouseEvent = DrawMouseMoveEvent | DrawMouseEnterOrLeaveEvent;
