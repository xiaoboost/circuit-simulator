import {
  PartStructuredData,
  LineStructuredData,
  ElectronicKind,
  ElectronicPrototype,
  ElectronicsStructuredData,
} from '@circuit/electronics';
import { createServiceKey, type Watcher } from '../../context';

/** 更新数据回调 */
export type CommitCb = (data: ElectronicsStructuredData) => void;

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
 * 画布服务键
 *
 * @description 该服务提供了画布服务
 * @example
 * ```ts
 * const painterService = usePainterService(PAINTER_SERVICE);
 * ```
 */
export const PAINTER_SERVICE =
  createServiceKey<IPainterService>('PainterService');

export interface IPainterService {
  /** 所有器件 */
  readonly parts: Watcher<PartStructuredData[]>;
  /** 所有导线 */
  readonly lines: Watcher<LineStructuredData[]>;
  /** 能否撤销 */
  readonly canUndo: Watcher<boolean>;
  /** 能否重做 */
  readonly canRedo: Watcher<boolean>;
  /** 画布状态 */
  readonly isReady: Watcher<boolean>;
  /** 获取器件 */
  getPart(id: string): Readonly<PartStructuredData>;
  /** 获取导线 */
  getLine(id: string): Readonly<LineStructuredData>;
  /** 获取原始定义 */
  getPartPrototype(kind: ElectronicKind): ElectronicPrototype;
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
