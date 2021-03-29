import { RefObject, useEffect } from 'react';

import { mapState } from './map';

import { Point } from 'src/math';
import { delay } from '@utils/func';
import { remove } from '@utils/array';
import { isFunc } from '@utils/assert';
import { MouseButtons } from '@utils/event';
import { supportsPassive } from '@utils/env';

type Callback = (event: DrawEvent) => any;
type StopEventInput = StopEventOption | ((event?: DrawEvent) => Promise<void>);
type CursorEventInput = string | ((event?: DrawEvent) => string);

/** 鼠标结束事件配置 */
export interface StopEventOption {
  type: 'click' | 'dblclick' | 'mousedown' | 'mouseup';
  which: keyof typeof MouseButtons;
}

/** 绘图事件 */
export interface DrawEvent {
  readonly movement: Readonly<Point>;
  readonly position: Readonly<Point>;
  readonly target: HTMLElement;
  readonly currentTarget: HTMLElement;
  readonly origin: MouseEvent;
}

/** 绘图事件控制器 */
export class DrawController {
  /** 图纸 DOM */
  static sheetEl?: HTMLElement;
  /** 绘图事件实例 */
  static data: DrawController[] = [];

  /** 是否开始 */
  isStart = false;
  /** 事件数据 */
  events: Callback[] = [];
  /** 停止事件数据 */
  stopEvent = () => Promise.resolve();

  constructor() {
    DrawController.data.push(this);
  }

  start() {
    this.isStart = true;
    return this.stopEvent().then(() => this.stop());
  }

  stop() {
    remove(DrawController.data, this);
  }

  setMoveEvent(cb: Callback) {
    this.events.push(cb);
    return this;
  }

  setStopEvent(input: StopEventInput) {
    if (isFunc(input)) {
      this.stopEvent = input;
      return this;
    }

    const body = document.body;
    const opts = supportsPassive
      ? { passive: true, capture: true }
      : true;

    this.stopEvent = () => new Promise<void>((resolve) => {
      body.addEventListener(
        input.type,
        function stop(event: MouseEvent) {
          if (event.button === MouseButtons[input.which]) {
            body.removeEventListener(input.type, stop, true);
            resolve();
          }
        },
        opts,
      );
    });

    return this;
  }
}

/** 事件总线初始化 */
export function useMouseBusInit(ref: RefObject<HTMLElement>) {
  useEffect(() => {
    if (!ref.current) {
      return;
    }

    // 保存 dom
    DrawController.sheetEl = ref.current;

    // 临时数据，上一次的节点
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

      const run = () => {
        DrawController.data
          .filter((draw) => draw.isStart)
          .forEach((draw) => {
            draw.events.forEach((handle) => handle(drawEvent));
          });
      };

      if (process.env.NODE_ENV === 'development') {
        delay().then(run);
      }
      else {
        run();
      }
    };
    const options = !supportsPassive ? true : {
      passive: true,
      capture: true,
    };
    
    DrawController.sheetEl.addEventListener('mousemove', mouseHandler, options);
  
    return () => {
      DrawController.sheetEl?.removeEventListener('mousemove', mouseHandler, true);
      DrawController.sheetEl = undefined;
    };
  }, [ref.current]);
}
