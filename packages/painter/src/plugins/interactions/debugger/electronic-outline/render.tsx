import React from 'react';
import { useService, useWatcher } from '../../../../context';
import {
  IPainterConfigurationService,
  ICollisionService,
  IMapCoordinateService,
} from '../../../../types';

const OutlineWidth = 2;

export function ElectronicOutline() {
  const configuration = useService(IPainterConfigurationService);
  const [electronicOutline] = useWatcher(configuration.visibleElectronicOutline);
  const collisionService = useService(ICollisionService);
  const mapService = useService(IMapCoordinateService);
  const [scale] = useWatcher(mapService.scale);

  if (!electronicOutline) {
    return null;
  }

  const rects = collisionService.getAllEntityRects();

  return (
    <g>
      {rects.map((rect, index) => (
        <rect
          key={index}
          x={rect.x}
          y={rect.y}
          width={rect.width}
          height={rect.height}
          stroke="black"
          strokeWidth={OutlineWidth / scale}
        />
      ))}
    </g>
  );
}
