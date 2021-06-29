import {
  EventKind,
  WorkerConstruction,
  WorkerMessageToChild,
  WorkerMessageToMain,
  WorkerMessageStore,
  WorkerCalledStore,
} from './types';

import { remove } from '@xiao-ai/utils';

const mainId = -1;

/** worker 服务 */
export class WorkerMainServer {
  /** worker 构造器 */
  private createWorker: WorkerConstruction;
  /** 子进程数据 */
  private worker!: Worker;
  /** 消息事件数据 */
  private messages: WorkerMessageStore[] = [];
  /** 接收事件数据暂存 */
  private called: WorkerCalledStore[] = [];
  /** 事件编号 */
  private eventId = 0;

  constructor(creator: WorkerConstruction) {
    this.createWorker = creator;
    this.create();
  }

  /** 创建线程 */
  private create() {
    this.worker = this.createWorker();
    this.worker.addEventListener('message', this.workerEvent.bind(this));
  }

  /** 子进程事件 */
  private workerEvent({ data }: MessageEvent<WorkerMessageToMain>) {
    if (data.to !== mainId) {
      return;
    }

    if (data.kind === EventKind.Message) {
      const event = this.messages.find((item) => {
        return item.to === data.from && item.name === item.name && item.eventId === data.eventId;
      });

      if (!event) {
        return;
      }

      if (data.error) {
        event.reject(data.error);
      }
      else {
        event.resolve(data.data);
      }

      remove(this.messages, event);
    }
    else if (data.kind === EventKind.Called) {
      const event = this.called.find((item) => item.name === item.name);
      event?.handler(data.data);
    }
  }

  /** 发送消息 */
  send<R = undefined, S = undefined>(name: string, data?: S): Promise<R> {
    return new Promise((resolve, reject) => {
      const message: WorkerMessageToChild = {
        kind: EventKind.Message,
        eventId: this.eventId++,
        from: mainId,
        to: 1,
        name,
        data,
      };

      this.worker.postMessage(message);
      this.messages.push({
        ...message,
        resolve,
        reject,
      });
    });
  }

  /** 监听消息 */
  on<T = any>(name: string, handler: (data: T) => any) {
    this.called.push({
      kind: EventKind.Called,
      from: mainId,
      to: 1,
      name,
      handler,
    });
  }
}
