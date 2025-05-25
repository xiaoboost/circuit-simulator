import type { Path } from '@circuit/algorithm';

/** 导线原始数据 */
export interface LineStoreData {
  /** 导线路径 */
  path: Path;
}

/** 导线结构化数据 */
export interface LineStructuredData extends LineStoreData {
  /** 导线编号 */
  id: string;
}
