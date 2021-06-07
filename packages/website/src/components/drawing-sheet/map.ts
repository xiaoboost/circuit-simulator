import { Point } from '@circuit/math';
import { Watcher } from '@xiao-ai/utils';
import { debug } from '@circuit/debug';
import { MouseButtons } from '@xiao-ai/utils/web';
import { DrawController } from 'src/lib/mouse';
import { cursorStyles } from 'src/styles';

import { useCallback, useEffect, MouseEvent, WheelEvent, RefObject } from 'react';

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
      .setClassName(cursorStyles.moveMap)
      .setStopEvent({ type: 'mouseup', which: 'Right' })
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

export function useDebugger(ref: RefObject<Element>) {
  let isInit = false

  useEffect(() => {
    if (process.env.NODE_ENV === 'development' && !isInit && ref.current) {
      isInit = true;
      ref.current.appendChild(debug.$el);
      (window as any).debug = debug;
    }
  }, [ref.current]);
}
