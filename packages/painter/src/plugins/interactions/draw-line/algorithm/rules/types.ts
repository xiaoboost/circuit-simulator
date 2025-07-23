import type { Point } from '@circuit/algorithm';
import type { MarkMap } from '../../../../../types';
import type { SearchNodeData } from '../a-star';

/** 搜索规则 */
export interface Rules {
  /** 节点估值 */
  cost: Cost;
  /** 节点合法性检查 */
  check: Check;
  /** 是否是终点 */
  isEnd: IsEnd;
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
  map: MarkMap;
}

/** 搜索规则上下文 */
export interface RulesContext extends RulesOptions{
  /** 排除器件 */
  excludeParts: string[];
  /** 排除线段 */
  excludeLines: [Point, Point][];
  /** 终点等效线段 */
  endLines: [Point, Point][];
}

/** 估值函数 */
export type Cost = (node: SearchNodeData) => number;
/** 合法性检查函数 */
export type Check = (node: SearchNodeData) => boolean;
/** 是否是终点函数 */
export type IsEnd = (node: SearchNodeData) => boolean;
