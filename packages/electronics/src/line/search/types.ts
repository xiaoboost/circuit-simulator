import type { Point } from '@circuit/math';
import type { LinePath } from '../path';

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

/** 搜索用节点数据 */
export interface SearchNodeData {
  /** 当前节点位置 */
  position: Point;
  /** 当前节点方向 */
  direction: Point;
  /** 当前节点估值 */
  value: number;
  /** 扩展到当前节点共有多少个弯道 */
  junction: number;
  /** 上个节点 */
  parent?: SearchNodeData;
  /** 上个拐弯节点 */
  cornerParent: SearchNodeData;
}

/** 节点搜索选项接口 */
export interface PointSearchOption {
  start: Point;
  end: Point;
  direction: Point;
  endBias?: Point;
  status: SearchStatus;
}

/** 规则集合 */
export interface PointSearchRule {
  /** 计算当前节点评估值 */
  calValue(node: SearchNodeData): number;
  /** 检查是否可以扩展此节点 */
  checkPoint(node: SearchNodeData): boolean;
  /** 是否是终点 */
  isEnd(node: SearchNodeData): boolean;
}
