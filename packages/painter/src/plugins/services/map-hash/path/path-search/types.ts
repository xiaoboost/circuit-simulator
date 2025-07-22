import type { Point } from '@circuit/algorithm';
import type { Entity } from '@circuit/types';
import type { SearchHook } from '../point-search';

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

/** 画布控制器 */
export interface PainterController {
  /** 获取鼠标覆盖状态 */
  getHover: () => Entity | undefined;
  /** 设置引脚大小 */
  setPinSize: (id: string, pin: number, size: number) => void;
  /** 恢复引脚大小 */
  clearPinSize: (id: string, pin: number) => void;
}

export interface PathSearchContext {
  /** 起点 */
  start: Point;
  /** 终点 */
  end: Point;
  /** 起始方向 */
  direction: Point;
  /** 画布控制器 */
  painter: PainterController;
  /** 搜索钩子 */
  hook?: SearchHook;
}
