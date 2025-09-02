import type { Point, PathWithPoint } from '@circuit/algorithm';
import type { PartStructuredData, LineStructuredData } from '@circuit/types';
import type {
  IConnectionDataWithPin,
  IMapHashMarkService,
  IMapHashCoreService,
  IMapHashAssertService,
} from '../../../../../types';
import type { Entity } from '../../constant';
import type { SearchHook } from '../a-star';

/** 搜索状态 */
export const enum SearchMode {
  // ========== 绘制导线 ==========
  /** 绘制搜索 */
  DrawNormal = 10,
  /** 点对齐 */
  DrawAlignPoint,
  /** 线对齐 */
  DrawAlignLine,

  /** 移动状态 */
  MoveNormal = 20,

  /** 变形状态 */
  DeformNormal = 30,
}

/** 画布状态 */
export interface PainterState
  extends
  IMapHashCoreService,
  IMapHashMarkService,
  IMapHashAssertService {
  /** 鼠标覆盖状态 */
  getHover: () => Entity | undefined;
  /** 获取元件数据 */
  getPart: (id: string) => Readonly<PartStructuredData> | undefined;
  /** 获取导线 */
  getLine: (id: string) => Readonly<LineStructuredData> | undefined;
  /** 获取连接数据 */
  getConnection: (id: string, pin: number) => Readonly<IConnectionDataWithPin>[];
}

/** 路径搜索器 */
export interface PathSearcher {
  /** 搜索函数 */
  (end: Point, bias?: Point): SearchResult[];
  /** 最后求得的导线路径 */
  getSearchPath: () => PathWithPoint;
}

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
   * 引脚样式
   *
   * @description 为空则为恢复原始样式
   */
  style?: Record<string, any>;
}

/** 搜索结果 */
export type SearchResult
  = | LinePathResult
    | PinSizeResult;

/** 路径搜索器选项 */
export interface PathSearcherOptions {
  /** 当前导线编号 */
  lineId: string;
  /** 起点 */
  start: Point;
  /** 起始方向 */
  direction: Point;
  /** 画布控制器 */
  painter: PainterState;
  /** 搜索钩子 */
  hook?: SearchHook;
}
