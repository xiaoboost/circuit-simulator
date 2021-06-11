import type { Point } from '@circuit/math';
import type { MouseButtons } from '@xiao-ai/utils/web';

export type Callback = (event: DrawEvent) => any;
export type StopEventInput = StopEventOption | ((event?: DrawEvent) => Promise<void>);
export type ClassNameEventInput = string | ((event?: DrawEvent) => string);

/** 鼠标结束事件配置 */
export interface StopEventOption {
  type: 'click' | 'dblclick' | 'mousedown' | 'mouseup';
  which: keyof typeof MouseButtons;
}

/** 绘图事件 */
export interface DrawEvent {
  readonly movement: Point;
  readonly position: Point;
  readonly target: HTMLElement;
  readonly currentTarget: HTMLElement;
  readonly origin: MouseEvent;
}

/** 图纸属性 */
export interface MapState {
  zoom: number;
  position: Point;
}
