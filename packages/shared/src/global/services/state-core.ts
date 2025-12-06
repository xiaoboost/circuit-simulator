import { createServiceKey } from '@circuit/inject';
import type { Watcher } from '@circuit/reactive';
import {
  type PartStructuredData,
  type LineStructuredData,
  type ElectronicKind,
  type ElectronicPrototype,
  type StructuredData,
  type LineOrPartStructuredData,
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
export const IStateCoreService
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

  // ========== 数据查询 ==========
  /** 编号转为引用编号 */
  getReferenceTag(ids: string[]): string[];
  /** 获取器件原型 */
  getPartPrototype(kind: ElectronicKind): ElectronicPrototype;
  /** 获取元件 */
  getElectronic(id: string): Readonly<LineOrPartStructuredData>;
  /** 获取器件 */
  getPart(id: string): Readonly<PartStructuredData>;
  /** 获取导线 */
  getLine(id: string): Readonly<LineStructuredData>;

  // ========== 数据管理 ==========
  /**
   * 暂存操作
   *
   * @description 将操作添加到暂存区，不会立即提交
   */
  stage(data: CommitData): void;
  /**
   * 清空暂存
   *
   * @description 清空所有暂存的操作
   */
  clearStage(): void;
  /**
   * 提交数据
   *
   * @description 提交数据，并记录操作日志。如果有暂存，会将暂存和传入的数据一起提交
   * @param data 可选，要提交的数据。如果不传且无暂存，则不执行任何操作
   */
  commit(data?: CommitData): void;
  /** 草稿 */
  draft(cb: CommitCb): void;
  /** 丢弃草稿 */
  dropDraft(): void;
  /** 撤销 */
  undo(): void;
  /** 重做 */
  redo(): void;
}
