import React from 'react';
import { useService, useWatcher } from '../../../../context';
import {
  PAINTER_CONFIGURATION_SERVICE,
  COLLISION_SERVICE,
  MAP_COORDINATE_SERVICE,
} from '../../../../types';

const OutlineWidth = 2;

export function ElectronicOutline() {
  const configuration = useService(PAINTER_CONFIGURATION_SERVICE);
  const [electronicOutline] = useWatcher(configuration.visibleElectronicOutline);
  const collisionService = useService(COLLISION_SERVICE);
  const mapService = useService(MAP_COORDINATE_SERVICE);
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
