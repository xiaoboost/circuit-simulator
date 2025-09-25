import { RefObject, useEffect } from 'react';
import { useService } from '../../../context';
import { IMapCoordinateService } from '../../../types';

export function usePosition(ref: RefObject<SVGGElement | null>) {
  const mapService = useService(IMapCoordinateService);

  useEffect(() => {
    if (!ref.current) {
      return;
    }

    const { position, scale } = mapService;
    const getTransform = () => `translate(${position.data.join(',')}) scale(${scale.data})`;

    const unobserveScale = mapService.scale.observe(() => {
      ref.current?.setAttribute('transform', getTransform());
    });
    const unobservePosition = mapService.position.observe(() => {
      ref.current?.setAttribute('transform', getTransform());
    });

    ref.current.setAttribute('transform', getTransform());

    return () => {
      unobserveScale();
      unobservePosition();
    };
  }, [ref.current]);
}
