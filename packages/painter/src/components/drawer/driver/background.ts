import { useService, useWatcher } from '../../../context';
import { IMapCoordinateService } from '../../../types';

export function useBackgroundStyle() {
  const mapService = useService(IMapCoordinateService);
  const [scale] = useWatcher(mapService.scale);
  const [position] = useWatcher(mapService.position);
  const size = scale * 20;
  const biasX = position[0] % size;
  const biasY = position[1] % size;

  return {
    backgroundSize: `${size}px`,
    backgroundPosition: `${biasX}px ${biasY}px`,
  };
}
