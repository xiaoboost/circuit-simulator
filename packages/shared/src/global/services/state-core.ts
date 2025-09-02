import { createServiceKey } from '@circuit/inject';
import type { Watcher } from '@circuit/reactive';
import {
  type PartStructuredData,
  type LineStructuredData,
  type ElectronicKind,
  type ElectronicPrototype,
  type StructuredData,
} from '@circuit/types';

/** 更新数据回调 */
export type CommitCb = (data: StructuredData) => void;

/** 更新数据参数 */
export interface CommitData {
  /** 操作名称 */
  name: string;
  /** 操作详细描述 */
  description: string;
  /** 更新数据 */
  patch: CommitCb;
}

/**
 * 状态核心服务键
 *
 * @description 该服务提供了状态核心服务
 * @example
 * ```ts
 * const stateService = useService(STATE_SERVICE);
 * ```
 */
export const STATE_CORE_SERVICE
  = createServiceKey<IStateCoreService>('StateCoreService');

export interface IStateCoreService {
  /**
   * 当前状态
   *
   * @description 有草稿时，指向草稿；无草稿时，指向最新提交
   */
  readonly state: Watcher<StructuredData>;
  /**
   * 提交状态
   *
   * @description 仅指向最新提交
   */
  readonly commitState: Watcher<StructuredData>;
  /** 能否撤销 */
  readonly canUndo: Watcher<boolean>;
  /** 能否重做 */
  readonly canRedo: Watcher<boolean>;
  /** 空图纸 */
  readonly isEmpty: Watcher<boolean>;
  /** 获取器件原型 */
  getPartPrototype(kind: ElectronicKind): ElectronicPrototype;
  /** 获取器件 */
  getPart(id: string): Readonly<PartStructuredData>;
  /** 获取导线 */
  getLine(id: string): Readonly<LineStructuredData>;
  /**
   * 提交数据
   *
   * @description 提交数据，并记录操作日志
   */
  commit(data: CommitData): void;
  /** 草稿 */
  draft(cb: CommitCb): void;
  /** 丢弃草稿 */
  dropDraft(): void;
  /** 撤销 */
  undo(): void;
  /** 重做 */
  redo(): void;
}
