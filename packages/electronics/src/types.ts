import type { LineStructuredData, LineStoreData } from './line';
import type { PartStructuredData, PartStoreData } from './part';

/** 元件总类别 */
export type ElectronicStructuredData = LineStructuredData | PartStructuredData;

/**
 * 储存数据
 *
 * @description 储存在数据库中的数据
 */
export interface ElectronicsStoreData {
  /** 元件 */
  parts: PartStoreData[];
  /** 导线 */
  lines: LineStoreData[];
}

/**
 * 状态数据
 *
 * @description 内存中的数据
 */
export interface ElectronicsStructuredData {
  /** 元件 */
  parts: PartStructuredData[];
  /** 导线 */
  lines: LineStructuredData[];
}
