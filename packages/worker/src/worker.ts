import {
  EventKind,
  WorkerCalledToMain,
  WorkerMessageToMain,
  WorkerMessageToChild,
  WorkerMessageChildData,
} from './types';

export class WorkerChildServer {
  /** 子进程编号 */
  private id = 0;
  /** 事件储存 */
  private events: WorkerMessageChildData[] = [];

  constructor() {
    self.addEventListener('message', this.workerEvent.bind(this));
  }

  /** 绑定事件 */
  private async workerEvent({ data }: MessageEvent<WorkerMessageToChild>) {
    if (data.to !== this.id) {
      return;
    }

    if (data.kind === EventKind.Message) {
      const handle = this.events.find((item) => item.name === data.name);

      if (!handle) {
        return;
      }

      let result: any;
      let err: string | undefined;

      try {
        result = await handle.handler(data.data);
      }
      catch (e) {
        err = e.message;
      }

      const returnVal: WorkerMessageToMain = {
        ...data,
        from: this.id,
        to: data.from,
        error: err,
        data: result,
      };

      (self as any).postMessage(returnVal);
    }
    else if (data.kind === EventKind.Init) {
      this.id = data.data;
    }
  }

  /** 监听事件 */
  on<R = undefined, S = undefined>(name: string, handler: (data: R) => S | Promise<S>) {
    this.events.push({
      name,
      handler,
    });
    return this;
  }

  /** 发送事件 */
  send(name: string, data: any) {
    const returnVal: WorkerCalledToMain = {
      kind: EventKind.Called,
      from: this.id,
      to: -1,
      name,
      data,
    };

    (self as any).postMessage(returnVal);
    return this;
  }
}
