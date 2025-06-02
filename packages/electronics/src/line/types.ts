import type { Path, PathWithPoint } from '@circuit/algorithm';

/** 导线原始数据 */
export interface LineStoreData {
  /** 导线路径 */
  path: Path;
}

/** 导线结构化数据 */
export interface LineStructuredData {
  /** 导线编号 */
  id: string;
  /** 导线路径 */
  path: PathWithPoint;
}
