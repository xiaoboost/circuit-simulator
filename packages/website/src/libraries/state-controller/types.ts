import { type Patch } from 'immer';

/** 补丁信息 */
export interface CommitPatch {
  /** 补丁名称 */
  readonly name: string;
  /** 补丁描述 */
  readonly description: string;
  /** 修改补丁 */
  readonly patches: Patch[];
  /** 逆向补丁 */
  readonly inversePatches: Patch[];
}
/** 订阅事件枚举 */
export enum SubscribeEventName {
  /** 状态变更 */
  Change,
  /** 撤销 */
  Undo,
  /** 重做 */
  Redo,
}
/** 订阅状态变更事件类型 */
export type SubscribeStateChangeEvent<T> = (state: T) => void;
/** 订阅操作栈变更类型 */
export type SubscribeStackChangeEvent = (name: string) => void;
/** 编辑回调 */
export type EditProducer<T> = (state: T) => void;
