import React from 'react';
import type { Point } from '@circuit/math';
import type { MouseButtons } from '@xiao-ai/utils/web';

export type Callback = (event: DrawEvent) => any;
export type StopEventInput = StopEventOption | ((event?: DrawEvent) => Promise<void>);
export type ClassNameEventInput = string | ((event?: DrawEvent) => string);

export interface DrawEventBusInitParam {
  mousemove(event: React.MouseEvent<HTMLElement>): void;
  enterPart(id: string): void;
  leavePart(id: string): void;
  enterLine(id: string): void;
  leaveLine(id: string): void;
}

export interface DrawEvent {
  /** 鼠标相对上次的移动距离 */
  readonly movement: Point;
  /** 鼠标在图纸中的距离 */
  readonly position: Point;
  /** 原始事件 */
  readonly origin: MouseEvent;
  /** 鼠标在元件内 */
  readonly enter?: MouseEnter;
  /** 设置当前鼠标样式 */
  setCursor(kind: string): void;
}

export enum MouseEnterKind {
  Part,
  Line,
}

export interface MouseEnter {
  /** 鼠标覆盖状态 */
  kind: MouseEnterKind;
  /** 覆盖元件 */
  id: string;
  /** 多个元件 */
  multi?: string;
}

export interface StopEventOption {
  type: 'click' | 'dblclick' | 'mousedown' | 'mouseup';
  which: keyof typeof MouseButtons;
}

export interface DrawEventBus {
  onMove(event: DrawEvent): DrawEventBus;
  onEnd(opt: StopEventOption): DrawEventBus;
  run(): Promise<void>;
}
