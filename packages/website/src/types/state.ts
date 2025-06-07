import {
  ElectronicsStoreData,
  ElectronicsStructuredData,
} from '@circuit/electronics';

/**
 * 储存数据
 *
 * @description 储存在数据库中的数据
 */
export interface StoreData extends ElectronicsStoreData {
  /** 版本 */
  version: string;
}
/**
 * 状态数据
 *
 * @description 内存中的数据
 */
export interface StructuredData extends ElectronicsStructuredData {
  /** 版本 */
  version: string;
}
