import type { IConfigurationService } from './configuration';
import type { ICursorService } from './cursor';
import type { IDebuggerService } from './debugger';
import type { IDragSceneService } from './drag-scene';
import type { IElectronicService } from './electronic';
import type { IEventBus } from './event-bus';
import type { ILoggerService } from './logger';
import type { IMapService } from './map';
import type { IMapCoordinateService } from './map-coordinate';
import type { IPainterHTMLElement } from './painter-dom';
import type { ISelectService } from './select';
import type { IVariableObserverService } from './variable-observer';

export * from './configuration';
export * from './map-coordinate';
export * from './cursor';
export * from './drag-scene';
export * from './map';
export * from './painter-dom';
export * from './electronic';
export * from './logger';
export * from './debugger';
export * from './variable-observer';
export * from './select';
export * from './event-bus';

export type ServiceType =
  | IConfigurationService
  | IDragSceneService
  | IMapCoordinateService
  | ICursorService
  | IMapService
  | IElectronicService
  | IPainterHTMLElement
  | ILoggerService
  | IDebuggerService
  | IVariableObserverService
  | ISelectService
  | IEventBus;
