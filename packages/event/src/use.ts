import { RefObject, useEffect } from 'react';
import { Point } from '@circuit/math';
import { delay } from '@xiao-ai/utils';
import { supportsPassive } from '@xiao-ai/utils/web';
import { MapState, DrawEvent } from './types';
import { sheetEl, current, setSheetElement } from './store';

/** 事件总线初始化 */
export function useMouseBusInit(ref: RefObject<HTMLElement>, getMapState: () => MapState) {
  useEffect(() => {
    if (!ref.current) {
      return;
    }

    // 保存 dom
    setSheetElement(ref.current);

    // 临时数据，上一次的节点
    let last: Point;

    const moveHandler = (event: MouseEvent) => {
      const map = getMapState();
      const mouse = new Point(event.pageX, event.pageY);
      const movement = last ? mouse.add(last, -1).mul(1 / map.zoom) : new Point(0, 0);
      const position = mouse.add(map.position, -1).mul(1 / map.zoom);
      const drawEvent: DrawEvent = {
        movement,
        position,
        target: event.target as HTMLElement,
        currentTarget: event.currentTarget as HTMLElement,
        origin: event,
      };

      last = mouse;

      /**
       * delay 内部的判断，主要是因为很有可能发生在 stop 函数已经运行，但是 move 回调在之后又运行的情况
       */
      if (current?.isStart) {
        delay().then(() => {
          if (current?.isStart) {
            current.events.forEach((handle) => handle(drawEvent));
          }
        });
      }
    };
    const options = !supportsPassive ? true : {
      passive: true,
      capture: true,
    };

    sheetEl?.addEventListener('mousemove', moveHandler, options);

    return () => {
      sheetEl?.removeEventListener('mousemove', moveHandler, true);
      setSheetElement();
    };
  }, [ref.current]);
}
