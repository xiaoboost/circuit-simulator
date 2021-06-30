import {
  EventKind,
  WorkerConstruction,
  WorkerMessageToChild,
  WorkerMessageToMain,
  WorkerMessageStore,
} from './types';

import { remove, ChannelData, AnyFunction } from '@xiao-ai/utils';

const mainId = -1;

/** worker 服务 */
export class WorkerMainServer {
  /** worker 构造器 */
  private createWorker: WorkerConstruction;
  /** 子进程数据 */
  private worker!: Worker;
  /** 消息事件数据 */
  private messageStore: WorkerMessageStore[] = [];
  /** 接收事件数据暂存 */
  private calledStore = new ChannelData<(data: any) => any>();
  /** 事件编号 */
  private eventId = 0;
  /** 当前最大子进程编号 */
  private childId = 1;

  constructor(creator: WorkerConstruction) {
    this.createWorker = creator;
    this.create();
  }

  /** 创建线程 */
  private create() {
    this.worker = this.createWorker();
    this.worker.addEventListener('message', this.workerEvent.bind(this));
    this.worker.postMessage({
      kind: EventKind.Init,
      data: this.childId,
    });
  }

  /** 子进程事件 */
  private workerEvent({ data }: MessageEvent<WorkerMessageToMain>) {
    if (data.to !== mainId) {
      return;
    }

    if (data.kind === EventKind.Message) {
      const event = this.messageStore.find((item) => {
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

      remove(this.messageStore, event);
    }
    else if (data.kind === EventKind.Called) {
      this.calledStore.forEachInChannel(data.name, (handler) => {
        handler(data.data);
      });
    }
  }

  /** 发送消息 */
  send<R = undefined, S = undefined>(name: string, data?: S): Promise<R> {
    return new Promise((resolve, reject) => {
      const message: WorkerMessageToChild = {
        kind: EventKind.Message,
        eventId: this.eventId++,
        from: mainId,
        to: this.childId,
        name,
        data,
      };

      this.worker.postMessage(message);
      this.messageStore.push({
        ...message,
        resolve,
        reject,
      });
    });
  }

  /** 监听消息 */
  on<T = any>(name: string, handler: (data: T) => any) {
    this.calledStore.push(name, handler);
  }

  /** 移除监听 */
  unOn(name: string, handler?: AnyFunction) {
    if (handler) {
      this.calledStore.remove(name, handler);
    }
    else {
      this.calledStore.remove(name);
    }
  }
}
