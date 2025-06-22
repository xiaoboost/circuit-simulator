import { type Patch } from 'immer';

export type { CommitData, CommitCb } from '@circuit/shared';

/** 补丁信息 */
export interface PatchWithComment {
  /** 补丁名称 */
  readonly name: string;
  /** 补丁描述 */
  readonly description: string;
  /** 补丁时间 */
  readonly time: number;
  /** 修改补丁 */
  readonly patches: Patch[];
  /** 逆向补丁 */
  readonly inversePatches: Patch[];
}
/** 订阅状态变更事件类型 */
export type SubscribeStateChangeEvent<T> = (state: T) => void;
/** 订阅操作栈变更类型 */
export type SubscribeStackChangeEvent = (name: string) => void;
