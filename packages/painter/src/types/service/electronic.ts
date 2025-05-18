import {
  PartStructuredData,
  LineStructuredData,
  ElectronicKind,
  ElectronicPrototype,
  ElectronicsStructuredData,
} from '@circuit/electronics';
import { createServiceKey, type Watcher } from '../../context';

/** 更新数据回调 */
export type CommitElectronic = (data: ElectronicsStructuredData) => void;

/** 更新数据参数 */
export interface CommitData {
  /** 操作名称 */
  name: string;
  /** 操作详细描述 */
  description: string;
  /** 更新数据 */
  patch: CommitElectronic;
}

/**
 * 元件服务键
 *
 * @description 该服务提供了元件的各种服务
 * @example
 * ```ts
 * const electronicService = usePainterService(ELECTRONIC_SERVICE_KEY);
 * ```
 */
export const ELECTRONIC_SERVICE_KEY =
  createServiceKey<IElectronicService>('ElectronicService');

export interface IElectronicService {
  /** 所有器件 */
  readonly parts: Watcher<PartStructuredData[]>;
  /** 所有导线 */
  readonly lines: Watcher<LineStructuredData[]>;
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
  commit(data: CommitElectronic): void;
}
