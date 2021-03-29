import { Point } from 'src/math';
import { Watcher } from 'src/lib/subject';
import { MouseButtons } from '@utils/event';
import { useCallback, MouseEvent, WheelEvent } from 'react';
import { DrawController } from './mouse';

export interface MapState {
  zoom: number;
  position: Point;
}

export const mapStateDefault: MapState = {
  zoom: 1,
  position: Point.from(0),
};

export const mapState = new Watcher(mapStateDefault);

export function useMap() {
  const sizeChangeEvent = useCallback((e: WheelEvent<HTMLElement>) => {
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

    mapState.setData({
      zoom: size,
      position: mapState.data.position
        .add(mousePosition, -1)
        .mul(size / mapState.data.zoom)
        .add(mousePosition)
        .round(1),
    });
  }, []);

  const moveStartEvent = useCallback((ev: MouseEvent<HTMLElement>) => {
    if (ev.button !== MouseButtons.Right) {
      return;
    }

    new DrawController()
      .setStopEvent({
        type: 'mouseup',
        which: 'Right',
      })
      .setMoveEvent((ev) => {
        const { zoom, position } = mapState.data;

        mapState.setData({
          zoom,
          position: position.add(ev.movement.mul(zoom)),
        });
      })
      .start();
  }, []);

  return {
    sizeChangeEvent,
    moveStartEvent,
  };
}
