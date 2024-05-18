import { Point } from '@circuit/math';
import { debug } from '@circuit/debug';
import { MouseButtons } from '@xiao-ai/utils/web';
import { DrawEventController } from '@circuit/event';
import { cursorStyles } from 'src/styles';
import { useCallback, useEffect, MouseEvent, WheelEvent, RefObject } from 'react';
import { Map } from '../../store';

export function useMap() {
  const sizeChangeEvent = useCallback((e: WheelEvent<Element>) => {
    const mousePosition = new Point(e.pageX, e.pageY);
    let size = Map.state.data.zoom * 20;

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

    Map.state.setData({
      zoom: size,
      position: Map.state.data.position
        .add(mousePosition, -1)
        .mul(size / Map.state.data.zoom)
        .add(mousePosition)
        .round(1),
    });
  }, []);

  const moveStartEvent = useCallback((ev: MouseEvent<Element>) => {
    if (ev.button !== MouseButtons.Middle) {
      return;
    }

    DrawEventController.create()
      .setClassName(cursorStyles.moveMap)
      .setStopEvent({ type: 'mouseup', which: 'Middle' })
      .setMoveEvent((ev) => {
        const { zoom, position } = Map.state.data;

        Map.state.setData({
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
