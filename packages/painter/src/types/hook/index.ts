import type { IDragScene } from './drag-scene';
import type { IEventListener } from './event-listener';
import type { IHotKey } from './hotkey';
import type { IDrawLayer, IViewLayer } from './layer';
import type { ILifeCycle } from './life-cycle';
import type { ILineRenderer } from './line';
import type { IPartRenderer } from './part';
import type { IPointRenderer } from './point';
import type { IPainterToolBarAction } from './toolbar';
import type { IComponentTooltipAction } from './tooltip';

export * from './drag-scene';
export * from './event-listener';
export * from './hotkey';
export * from './layer';
export * from './line';
export * from './part';
export * from './point';
export * from './tooltip';
export * from './toolbar';
export * from './life-cycle';

/** 钩子总类别 */
export type HookType =
  | IDragScene
  | IHotKey
  | IEventListener
  | IDrawLayer
  | IViewLayer
  | IComponentTooltipAction
  | ILineRenderer
  | IPartRenderer
  | IPointRenderer
  | IPainterToolBarAction
  | ILifeCycle;
