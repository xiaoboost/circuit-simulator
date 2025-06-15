import type { ICollisionService } from './collision';
import type { IConnectionService } from './connection';
import type { ICursorService } from './cursor';
import type { IDragSceneService } from './drag-scene';
import type { IMapCoordinateService } from './map-coordinate';
import type { IMapService } from './map-hash';
import type { IPainterHTMLElement } from './painter-dom';
import type { ISelectService } from './select';
import type { IVariableObserverService } from './variable-observer';

export * from './collision';
export * from './connection';
export * from './map-coordinate';
export * from './cursor';
export * from './drag-scene';
export * from './map-hash';
export * from './painter-dom';
export * from './variable-observer';
export * from './select';

export type ServiceType =
  | ICollisionService
  | IDragSceneService
  | IMapCoordinateService
  | ICursorService
  | IMapService
  | IPainterHTMLElement
  | IVariableObserverService
  | ISelectService
  | IConnectionService;
