import { RefObject, useEffect } from 'react';

import { mapState } from '../components/drawing-sheet/map';

import { Point } from 'src/math';
import { delay } from '@utils/func';
import { isFunc } from '@utils/assert';
import { MouseButtons } from '@utils/event';
import { supportsPassive } from '@utils/env';

type Callback = (event: DrawEvent) => any;
type StopEventInput = StopEventOption | ((event?: DrawEvent) => Promise<void>);
type ClassNameEventInput = string | ((event?: DrawEvent) => string);

/** 鼠标结束事件配置 */
export interface StopEventOption {
  type: 'click' | 'dblclick' | 'mousedown' | 'mouseup';
  which: keyof typeof MouseButtons;
}

/** 绘图事件 */
export interface DrawEvent {
  readonly movement: Point;
  readonly position: Point;
  readonly target: HTMLElement;
  readonly currentTarget: HTMLElement;
  readonly origin: MouseEvent;
}

/** 绘图事件控制器 */
export class DrawController {
  /** 图纸 DOM */
  static sheetEl?: HTMLElement;
  /** 绘图事件实例 */
  static current?: DrawController;

  /** 是否开始 */
  isStart = false;
  /** 事件数据 */
  events: Callback[] = [];
  /** 记录当前 className */
  className = '';
  /** 记录当前 cursor */
  cursor = '';
  /** 停止事件数据 */
  stopEvent = () => Promise.resolve();

  constructor() {
    if (!DrawController.current) {
      DrawController.current = this;
    }
  }

  start() {
    // 当前事件不是自己，则不启动
    if (DrawController.current !== this) {
      return Promise.resolve();
    }

    this.isStart = true;
    this.className = DrawController.sheetEl?.getAttribute('class') ?? '';
    return this.stopEvent().then(() => this.stop());
  }

  stop() {
    DrawController.current = undefined;

    if (DrawController.sheetEl) {
      DrawController.sheetEl.setAttribute('class', this.className);
      DrawController.sheetEl.style.cursor = '';
    }
  }

  setClassName(input: ClassNameEventInput) {
    if (isFunc(input)) {
      this.events.push((ev) => {
        DrawController.sheetEl?.classList.add(input(ev));
      });
    }
    else {
      this.events.push(() => {
        DrawController.sheetEl?.classList.add(input);
      });
    }

    return this;
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
      const { current } = DrawController;
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

      if (!current || !current.isStart) {
        return;
      }

      const run = () => current.events.forEach((handle) => handle(drawEvent));

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
