import type { Point, PathWithPoint } from '@circuit/algorithm';
import type { MarkMap, Entity } from '../../constant';
import type { SearchHook } from '../a-star';

/** 搜索状态 */
export const enum SearchMode {
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

/** 画布状态 */
export interface PainterState {
  /** 鼠标覆盖状态 */
  getHover: () => Entity | undefined;
}

/** 路径搜索器 */
export type PathSearcher = (end: Point, bias?: Point) => SearchResult[];

/** 导线路径结果 */
export interface LinePathResult {
  /** 导线编号 */
  id: string;
  /** 导线路径 */
  path: PathWithPoint;
}

/** 引脚大小结果 */
export interface PinSizeResult {
  /** 元件编号 */
  id: string;
  /** 引脚编号 */
  pin: number;
  /**
   * 引脚半径
   *
   * @description 为空则为恢复原大小
   */
  size?: number;
}

/** 搜索结果 */
export type SearchResult =
  | LinePathResult
  | PinSizeResult;

/** 路径搜索器选项 */
export interface PathSearcherOptions {
  /** 当前导线编号 */
  lineId: string;
  /** 起点 */
  start: Point;
  /** 起始方向 */
  direction: Point;
  /** 标记图纸 */
  map: MarkMap;
  /** 画布控制器 */
  painter: PainterState;
  /** 搜索钩子 */
  hook?: SearchHook;
}
