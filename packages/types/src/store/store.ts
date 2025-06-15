import { LineStructuredData, LineStoreData } from '../line';
import { PartStructuredData, PartStoreData } from '../part';

/** 元件总类别 */
export type LineOrPartStructuredData = LineStructuredData | PartStructuredData;

export interface BaseStoreData {
  /** 版本 */
  version: string;
}

/**
 * 储存数据
 *
 * @description 储存在数据库中的数据
 */
export interface StoreData extends BaseStoreData {
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
export interface StructuredData extends BaseStoreData {
  /** 元件 */
  parts: PartStructuredData[];
  /** 导线 */
  lines: LineStructuredData[];
}
