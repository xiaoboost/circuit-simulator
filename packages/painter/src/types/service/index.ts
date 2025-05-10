import type { IConfigurationService } from './configuration-service';
import type { ICursorService } from './cursor';
import type { IDragSceneService } from './drag-scene-service';
import type { IElectronicService } from './electronic-service';
import type { IMapCoordinateService } from './map-coordinate';
import type { IMapMarkService } from './map-mark-service';
import type { IPainterHTMLElement } from './painter-dom';

export * from './configuration-service';
export * from './map-coordinate';
export * from './cursor';
export * from './drag-scene-service';
export * from './map-mark-service';
export * from './painter-dom';
export * from './electronic-service';

export type ServiceType =
  | IConfigurationService
  | IDragSceneService
  | IMapCoordinateService
  | ICursorService
  | IMapMarkService
  | IElectronicService
  | IPainterHTMLElement;
