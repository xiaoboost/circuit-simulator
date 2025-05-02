import type { IDragScene } from './drag-scene';
import type { IEventListener } from './event-listener';
import type { IHotKey } from './hotkey';
import type { IDrawLayer, IViewLayer } from './layer';
import type { IComponentTooltipAction } from './tooltip';

export * from './drag-scene';
export * from './event-listener';
export * from './hotkey';
export * from './layer';
export * from './tooltip';

/** 钩子总类别 */
export type HookType =
  | IDragScene
  | IHotKey
  | IEventListener
  | IDrawLayer
  | IViewLayer
  | IComponentTooltipAction;
