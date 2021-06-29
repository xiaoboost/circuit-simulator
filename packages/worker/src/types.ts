/** worker 构造器 */
export type WorkerConstruction = () => Worker;

export enum EventKind {
  /** 初始化事件 */
  Init,
  /** 被呼叫事件 */
  Called,
  /** 消息事件 */
  Message,
}

/** worker 进程返回到主进程的事件数据 */
export interface WorkerEventBaseData {
  /** 事件种类 */
  kind: EventKind;
  /** 事件名称 */
  name: string;
  /**
   * 事件来源
   *  - `-1`表示主进程
   *  - 大于等于`0`时表示 worker 进程
   */
  from: number;
  /**
   * 事件来源
   *  - `-1`表示主进程
   *  - 大于等于`0`时表示 worker 进程
   */
  to: number;
}

/** 消息事件数据储存 */
export interface WorkerMessageStore extends WorkerEventBaseData {
  /** promise resolve 回调 */
  resolve(data?: any): void;
  /** promise reject 回调 */
  reject(error?: any): void;
  /** 事件编号 */
  eventId: number;
}

/** 消息事件给子进程 */
export interface WorkerMessageToChild extends WorkerEventBaseData {
  data: any;
  eventId: number;
}

/** 消息事件给主进程 */
export interface WorkerMessageToMain extends WorkerEventBaseData {
  data: any;
  error?: any;
  eventId: number;
}

/** 被呼叫事件数据 */
export interface WorkerCalledStore extends WorkerEventBaseData {
  handler(data: any): any;
}

/** 被呼叫事件数据给主进程 */
export interface WorkerCalledToMain extends WorkerEventBaseData {
  data: any;
}

/** 事件回调 */
export type Handler<R, S> = (data: R) => S | Promise<S>

/** 在子进程储存的事件 */
export interface WorkerMessageChildData {
  name: string;
  handler: Handler<any, any>;
}
