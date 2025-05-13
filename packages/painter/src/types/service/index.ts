import type { IConfigurationService } from './configuration';
import type { ICursorService } from './cursor';
import type { IDebuggerService } from './debugger';
import type { IDragSceneService } from './drag-scene';
import type { IElectronicService } from './electronic';
import type { ILoggerService } from './logger';
import type { IMapService } from './map';
import type { IMapCoordinateService } from './map-coordinate';
import type { IPainterHTMLElement } from './painter-dom';

export * from './configuration';
export * from './map-coordinate';
export * from './cursor';
export * from './drag-scene';
export * from './map';
export * from './painter-dom';
export * from './electronic';
export * from './logger';
export * from './debugger';

export type ServiceType =
  | IConfigurationService
  | IDragSceneService
  | IMapCoordinateService
  | ICursorService
  | IMapService
  | IElectronicService
  | IPainterHTMLElement
  | ILoggerService
  | IDebuggerService;
