import type { DragScene } from './drag-scene';
import type { EventListener } from './event-listener';
import type { HotKey } from './hotkey';
import type { DrawLayer, ViewLayer } from './layer';
import type { LifeCycle } from './life-cycle';
import type { ComponentTooltipAction } from './tooltip';

export * from './drag-scene';
export * from './event-listener';
export * from './hotkey';
export * from './layer';
export * from './life-cycle';
export * from './tooltip';

/** 钩子总类别 */
export type HookType =
  | DragScene
  | HotKey
  | EventListener
  | LifeCycle
  | DrawLayer
  | ViewLayer
  | ComponentTooltipAction;
