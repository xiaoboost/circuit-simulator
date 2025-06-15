import { type Patch } from 'immer';

export type { CommitData, CommitCb, State } from '@circuit/shared';

/** 补丁信息 */
export interface PatchWithComment {
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
  /**
   * 状态变更
   *
   * @description 提交草稿时也会触发
   */
  Change,
  /**
   * 提交数据
   *
   * @description 仅在提交数据时触发
   */
  Commit,
  /** 撤销 */
  Undo,
  /** 重做 */
  Redo,
}
/** 订阅状态变更事件类型 */
export type SubscribeStateChangeEvent<T> = (state: T) => void;
/** 订阅操作栈变更类型 */
export type SubscribeStackChangeEvent = (name: string) => void;
