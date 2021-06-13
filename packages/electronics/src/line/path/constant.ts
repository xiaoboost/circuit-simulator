/** 搜索状态 */
export const enum SearchStatus {
  // 绘制搜索
  /** 普通状态 */
  DrawSpace = 10,
  /** 对齐引脚 */
  DrawAlignPoint,
  /** 对齐导线 */
  DrawAlignLine,
  /** 导线修饰 */
  DrawModification,
}
