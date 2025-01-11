import { Point } from '@circuit/math';
import { supportsPassive } from '@xiao-ai/utils/web';
import { sheetEl } from './store';
import { DrawEventData } from './types';
import { Map } from '../../../store';

export function observableSheetEl(el: HTMLElement) {
  Map.state.data;

  /** 创建回调 */
  function createHandler(channel: DrawEventData['type']) {
    /**  上一次的节点 */
    let last: Point;
    /** 选择器缓存 */
    const delegateMap: Record<string, Map<Element, boolean>> = {};

    return function mouseHandler(event: MouseEvent) {
      const mouse = new Point(event.pageX, event.pageY);
      const movement = last ? mouse.add(last, -1).mul(1 / mapState.zoom) : new Point(0, 0);
      const position = mouse.add(mapState.position, -1).mul(1 / mapState.zoom);
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
      if (current && current.isStart) {
        delay().then(() => {
          if (current && current.isStart) {
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
          }
        });
      }
    };
  }

  const options = !supportsPassive ? true : {
    passive: true,
    capture: true,
  };
  const moveHandler = createHandler('mousemove');

  sheetEl?.addEventListener('mousemove', moveHandler, options);
}

export function unObservableSheetEl(el: HTMLElement) {
  // ..
}
