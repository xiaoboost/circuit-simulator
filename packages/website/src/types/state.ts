import { PartStructuredData, LineStructuredData } from '@circuit/electronics';

/** 元件储存数据 */
export type PartStoreData = Omit<PartStructuredData, 'connections'>;
/** 导线储存数据 */
export type LineStoreData = Omit<LineStructuredData, 'id' | 'kind' | 'connections'>;
/**
 * 储存数据
 *
 * @description 储存在数据库中的数据
 */
export interface StoreData {
  /** 版本 */
  version: string;
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
export interface StateData {
  /** 版本 */
  version: string;
  /** 元件 */
  parts: PartStructuredData[];
  /** 导线 */
  lines: LineStructuredData[];
}
