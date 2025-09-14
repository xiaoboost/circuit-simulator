import type { Point, SegmentWithPoint } from '@circuit/algorithm';
import type { SearchNodeData } from '../a-star';
import type { SearchMode, PainterState } from '../searcher';

/** 搜索规则 */
export interface Rules {
  /** 节点估值 */
  cost: Cost;
  /** 节点合法性检查 */
  check: Check;
  /** 是否是终点 */
  isEnd: IsEnd;
  /** 终点数据 */
  getEnd(): Point;
}

/** 搜索规则上下文 */
export interface RulesOptions {
  /** 起点 */
  start: Point;
  /** 终点 */
  end: Point;
  /** 初始方向 */
  direction: Point;
  /** 标记图纸数据 */
  painter: PainterState;
  /** 搜索模式 */
  mode: SearchMode;
}

/** 搜索规则上下文 */
export interface RulesContext extends RulesOptions {
  /** 终线 */
  endLines: SegmentWithPoint[];
}

/** 估值函数 */
export type Cost = (node: SearchNodeData) => number;
/** 合法性检查函数 */
export type Check = (node: SearchNodeData) => boolean;
/** 是否是终点函数 */
export type IsEnd = (node: SearchNodeData) => boolean;
