import type { Point, PathWithPoint } from '@circuit/algorithm';
import type { Rules } from '../rules';

/** 搜索用节点数据 */
export interface SearchNodeData {
  /** 当前节点位置 */
  position: Point;
  /** 当前节点是由什么方向扩展而来 */
  direction: Point;
  /** 当前节点估值 */
  value: number;
  /** 扩展到当前节点共有多少个弯道 */
  junction: number;
  /** 当前节点的祖节点 */
  parent?: SearchNodeData;
  /** 当前节点拐弯的祖节点 */
  cornerParent: SearchNodeData;
}

/** 节点搜索选项接口 */
export interface AStarSearchOption {
  /** 起点 */
  start: Point,
  /** 终点 */
  end: Point,
  /** 初始方向 */
  direction: Point,
  /** 搜索规则 */
  rules: Rules;
  /**
   * 终点偏移
   *
   * @description 终点有多个候选时，会使用这个偏移量来选择
   */
  endBias?: Point;
  /** 搜索钩子 */
  hook?: SearchHook;
}

/** 搜索钩子函数 */
export interface SearchHook {
  /** 开始搜索 */
  start?(start: Point, end: Point, direction: Point): void;
  /** 结束搜索 */
  end?(path: PathWithPoint): void;
  /** 待扩展节点 */
  expand?(node: SearchNodeData): void;
  /** 已扩展结点 */
  used?(node: SearchNodeData): void;
  /** 搜索结束 */
  afterEnd?(): void;
}
