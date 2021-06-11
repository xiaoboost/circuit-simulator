
import { delay, isFunc } from '@xiao-ai/utils';
import { MouseButtons, supportsPassive } from '@xiao-ai/utils/web';
import { current, sheetEl, setCurrent } from './store';
import { Callback, StopEventInput, ClassNameEventInput } from './types';

/** 绘图事件控制器 */
export class DrawEventController {
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

  setClassName(input: ClassNameEventInput) {
    if (isFunc(input)) {
      this.events.push((ev) => {
        sheetEl?.classList.add(input(ev));
      });
    }
    else {
      this.events.push(() => {
        sheetEl?.classList.add(input);
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
