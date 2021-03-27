import { Point } from 'src/math';

import { mapState, MapState } from './state';
import { RefObject, useEffect } from 'react';

export function useMap(ref: RefObject<HTMLElement>) {
  if (process.env.NODE_ENV === 'development') {
    if (typeof ref !== 'object' || typeof ref.current === 'undefined') {
      console.error('useMap expects a single ref argument.');
    }
  }

  const setMap = (val: Partial<MapState>) => {
    mapState.setData({
      ...mapState.data,
      ...val,
    });
  };

  useEffect(() => {
    const wheelHandler = (e: WheelEvent) => {
      if (ref && ref.current) {
        const mousePosition = new Point(e.pageX, e.pageY);
        let size = mapState.data.zoom * 20;

        if (e.deltaY > 0) {
          size -= 5;
        }
        else if (e.deltaY < 0) {
          size += 5;
        }

        if (size < 20) {
          size = 20;
          return;
        }
        if (size > 80) {
          size = 80;
          return;
        }

        size = size / 20;

        setMap({
          zoom: size,
          position: mapState.data.position
            .add(mousePosition, -1)
            .mul(size / mapState.data.zoom)
            .add(mousePosition)
            .round(1),
        });
      }
    };

    ref.current?.addEventListener('wheel', wheelHandler);
  
    return () => {
      ref.current?.removeEventListener('wheel', wheelHandler);
    };
  }, [ref.current]);

  return { ...mapState.data };
}
