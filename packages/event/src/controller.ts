
import { delay, isFunc, ChannelData } from '@xiao-ai/utils';
import { MouseButtons, supportsPassive, addClassName } from '@xiao-ai/utils/web';
import { current, sheetEl, setCurrent } from './store';

import {
  Callback,
  StopEventInput,
  ClassNameEventInput,
  DrawEventData,
  DrawEvent,
} from './types';

/** 绘图事件控制器 */
export class DrawEventController {
  /** 是否开始 */
  isStart = false;
  /** 初始化完成 */
  initialized = false;
  /** 记录当前 className */
  className = '';
  /** 记录当前 cursor */
  cursor = '';
  /** 初始事件 */
  initEvent?: Callback;
  /** 事件数据 */
  events = new ChannelData<DrawEventData>();
  /** 停止事件数据 */
  stopEvent = () => Promise.resolve();

  constructor() {
    if (!current) {
      setCurrent(this);
    }
  }

  async start() {
    // 当前事件不是自己，则不启动
    if (current !== this) {
      return;
    }

    await delay();

    this.isStart = true;
    this.initialized = false;
    this.className = sheetEl?.getAttribute('class') ?? '';

    await this.stopEvent();

    this.stop();
  }

  stop() {
    const className = this.className;

    this.isStart = false;
    this.className = '';

    setCurrent();

    if (sheetEl) {
      sheetEl.setAttribute('class', className);
      sheetEl.style.cursor = '';
    }
  }

  setInitEvent(cb: Callback) {
    this.initEvent = cb;
    return this;
  }

  setClassName(input: ClassNameEventInput) {
    const name = 'mousemove';
    const handler: DrawEventData = isFunc(input)
      ? {
        type: name,
        selector: '',
        callback: (ev: DrawEvent) => {
          if (sheetEl) {
            addClassName(sheetEl, input(ev));
          }
        },
      }
      : {
        type: name,
        selector: '',
        callback: () => {
          if (sheetEl) {
            addClassName(sheetEl, input);
          }
        },
      };

    this.events.push(name, handler);

    return this;
  }

  setMoveEvent(cb: Callback) {
    const name = 'mousemove';
    this.events.push(name, {
      type: name,
      selector: '',
      callback: cb,
    });
    return this;
  }

  setEvent(opt: DrawEventData) {
    this.events.push(opt.type, opt);
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
