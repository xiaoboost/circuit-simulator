import { RefObject, useEffect } from 'react';
import { Point } from '@circuit/math';
import { delay } from '@xiao-ai/utils';
import { supportsPassive } from '@xiao-ai/utils/web';
import { MapState, DrawEvent, DrawEventData } from './types';
import { sheetEl, current, setSheetElement } from './store';

/** 事件总线初始化 */
export function useMouseBusInit(ref: RefObject<HTMLElement>, getMapState: () => MapState) {
  useEffect(() => {
    if (!ref.current) {
      return;
    }

    // 保存 dom
    setSheetElement(ref.current);

    /** 创建回调 */
    function createHandler(channel: DrawEventData['type']) {
      /**  上一次的节点 */
      let last: Point;
      /** 选择器缓存 */
      const delegateMap: Record<string, Map<Element, boolean>> = {};

      return function mouseHandler(event: MouseEvent) {
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
         * delay 内部的判断，主要是因为很有可能发生在 stop 函数已经运行，
         * 但是 move 回调在之后又运行的情况
         */
        if (!current || !current.start) {
          return;
        }

        delay().then(() => {
          if (!current || !current.start) {
            return;
          }

          if (!current.initialized && current.initEvent) {
            current.initEvent(drawEvent);
            current.initialized = true;
          }

          current.events.forEachInChannel(channel, (handle) => {
            if (!handle.selector) {
              handle.callback(drawEvent);
              return;
            }

            if (!delegateMap[handle.selector]) {
              delegateMap[handle.selector] = new Map<Element, boolean>();

              Array.from(sheetEl!.querySelectorAll(handle.selector)).forEach((el) => {
                delegateMap[handle.selector].set(el, true);
              });
            }

            if (delegateMap[handle.selector].has(drawEvent.target)) {
              handle.callback(drawEvent);
            }
          });
        });
      };
    }

    const options = !supportsPassive ? true : {
      passive: true,
      capture: true,
    };
    const moveHandler = createHandler('mousemove');
    const enterHandler = createHandler('mouseenter');
    const leaveHandler = createHandler('mouseleave');

    sheetEl?.addEventListener('mousemove', moveHandler, options);
    sheetEl?.addEventListener('mouseenter', enterHandler, options);
    sheetEl?.addEventListener('mouseleave', leaveHandler, options);

    return () => {
      sheetEl?.removeEventListener('mousemove', moveHandler, true);
      sheetEl?.removeEventListener('mouseenter', moveHandler, true);
      sheetEl?.removeEventListener('mouseleave', moveHandler, true);
      setSheetElement();
    };
  }, [ref.current]);
}
