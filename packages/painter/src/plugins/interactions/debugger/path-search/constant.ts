import type { Point, PathWithPoint } from '@circuit/algorithm';

/** 导线搜索节点 */
export const PATH_SEARCH_POINTS_STATE = Symbol('PATH_SEARCH_POINTS');

/** 节点和价值 */
export interface PointWithValue {
  point: Point;
  value: number;
}

/** 导线搜索节点储存结构 */
export interface PathSearchPointData {
  /** 当前节点 */
  current?: Point;
  /** 起点 */
  start?: Point;
  /** 终点 */
  end?: Point;
  /** 扩展结点 */
  expand?: PointWithValue[];
  /** 搜索结果 */
  result?: PathWithPoint;
}

/** 导线搜索节点颜色 */
export const SearchPointColor = {
  current: 'red',
  start: 'blue',
  end: 'green',
  expand: 'yellow',
  result: 'purple',
};
