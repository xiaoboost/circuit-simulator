import { RefObject, useEffect } from 'react';

import { mapState } from './state';

import { delay } from '@utils/func';
import { Point } from 'src/math';
import { removeVal } from '@utils/array';
import { supportsPassive } from '@utils/env';

type Callback = (event: DrawEvent) => any | Promise<any>;
type StopEventInput = StopEventOption | ((event?: DrawEvent) => Promise<void>);
type CursorEventInput = string | ((event?: DrawEvent) => string | Promise<string>);

/** 鼠标结束事件配置 */
export interface StopEventOption {
  el?: HTMLElement;
  type: 'click' | 'dblclick' | 'mousedown' | 'mouseup';
  which: 'left' | 'middle' | 'right';
}

/** 绘图事件 */
export interface DrawEvent {
  readonly movement: Readonly<Point>;
  readonly position: Readonly<Point>;
  readonly target: HTMLElement;
  readonly currentTarget: HTMLElement;
  readonly origin: MouseEvent;
}

export class DrawController {
  private el: Element;

  events: Callback[] = [];

  constructor(el: Element) {
    this.el = el;
  }

  start() {

  }

  stop() {

  }

  setMoveEvent(cb: Callback) {

  }

  setStopEvent(option: StopEventInput) {

  }
}

/** 全局事件储存 */
const _events: DrawController[] = [];

export function useMouseBus(ref: RefObject<HTMLElement>) {
  if (process.env.NODE_ENV === 'development') {
    if (typeof ref !== 'object' || typeof ref.current === 'undefined') {
      console.error('useMouseBus expects a single ref argument.');
    }
  }

  useEffect(() => {
    let last: Point;

    const mouseHandler = (event: MouseEvent) => {
      const { data: map } = mapState;
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

      if (process.env.NODE_ENV === 'development') {
        delay().then(() => {
          _events.forEach((item) => {
            item.events.forEach((handle) => {
              handle(drawEvent);
            });
          });
        });
      }
      else {
        _events.forEach((item) => {
          item.events.forEach((handle) => {
            handle(drawEvent);
          });
        });
      }

    };

    if (ref.current) {
      if (supportsPassive) {
        ref.current.addEventListener('mousemove', mouseHandler, {
          passive: true,
          capture: true,
        });
      }
      else {
        ref.current.addEventListener('mousemove', mouseHandler, true);
      }
    }
  
    return () => {
      ref.current?.removeEventListener('mousemove', mouseHandler, true);
    };
  }, [ref.current]);

  return () => new DrawController(ref.current!);
}
