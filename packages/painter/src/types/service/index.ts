import type { ICursorService } from './cursor';
import type { IDragSceneService } from './drag-scene-service';
import type { IMapCoordinateService } from './map-coordinate';
import type { IMapMarkService } from './map-mark-service';

export * from './map-coordinate';
export * from './cursor';
export * from './drag-scene-service';
export * from './map-mark-service';

export type ServiceType =
  | IDragSceneService
  | IMapCoordinateService
  | ICursorService
  | IMapMarkService;
