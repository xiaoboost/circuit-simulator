import type { Point } from '@circuit/math';

export enum SearchStatus {
  /** 普通状态 */
  DrawSpace = 10,
  /** 对齐引脚 */
  DrawAlignPoint,
  /** 对齐导线 */
  DrawAlignLine,
  /** 导线修饰 */
  DrawModification,
}

export interface SearchContext {
  position: Point;
}
