/** 搜索状态 */
export const enum SearchStatus {
  // 绘制搜索
  /** 绘制普通状态 */
  DrawNormal = 10,
  /** 对齐引脚 */
  DrawAlignPoint,
  /** 对齐导线 */
  DrawAlignLine,
  /** 导线修饰 */
  DrawModification,

  /** 移动状态 */
  MoveNormal = 20,

  /** 变形状态 */
  DeformNormal = 30,
}

/** 搜索上下文 */
export interface SearchContext {

}
