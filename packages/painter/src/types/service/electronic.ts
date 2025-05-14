import {
  PartStructuredData,
  LineStructuredData,
  ElectronicKind,
  ElectronicPrototype,
  ElectronicStructuredData,
} from '@circuit/electronics';
import { createServiceKey, type Watcher } from '../../context';

/** 更新数据回调 */
export type UpdateElectronic = (data: ElectronicStructuredData) => ElectronicStructuredData;

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
  parts: Watcher<PartStructuredData[]>;
  /** 所有导线 */
  lines: Watcher<LineStructuredData[]>;
  /** 获取器件 */
  getPart(id: string): Readonly<PartStructuredData>;
  /** 获取导线 */
  getLine(id: string): Readonly<LineStructuredData>;
  /** 获取原始定义 */
  getPartPrototype(kind: ElectronicKind): ElectronicPrototype;
  /** 更新数据 */
  updateData(cb: UpdateElectronic): void;
}
