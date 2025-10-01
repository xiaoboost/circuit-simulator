import type { Point } from '@circuit/algorithm';
import type { PartStructuredData, LineStructuredData, StructuredData } from '@circuit/types';
import { createServiceKey } from '../../context';

/**
 * 图纸服务键
 *
 * @description 图纸服务，该服务主要是提供图纸相关服务，比如元件连接关系等。
 * @example
 * ```ts
 * const mapService = useService(IMapHashService);
 * ```
 */
export const IMapHashService
  = createServiceKey<IMapHashService>('MapHash');

export interface ConnectionData {
  /** 左侧连通性 */
  left?: boolean;
  /** 右侧连通性 */
  right?: boolean;
  /** 上侧连通性 */
  top?: boolean;
  /** 下侧连通性 */
  bottom?: boolean;
}

export type MarkMap = Map<string, Mark>;

/** 节点类型常量 */
export enum MarkKind {
  /** 导线 */
  Line,
  /** 导线节点 */
  LinePoint,
  /** 交错节点 */
  LineCross,
  /** 交叠节点 */
  LineCover,
  /** 器件节点 */
  Part,
  /** 器件空引脚节点 */
  PartPin,
  /** 器件引脚节点连接导线 */
  PartPinLine,
}

interface BaseMark {
  /** 类型 */
  kind: MarkKind;
  /** 编号 */
  id: string;
  /** 位置 */
  position: Point;
  /** 连接数据 */
  connection: ConnectionData;
}

/** 交叠节点数据 */
export interface LineCoverMark extends Omit<BaseMark, 'id' | 'connection'> {
  /** 节点类型 */
  kind: MarkKind.LineCover;
  /** 导线编号 */
  lines: string[];
  /** 连接数据 */
  connections: Record<string, ConnectionData>;
}

/** 交错节点数据 */
export interface LineCrossMark extends Omit<BaseMark, 'id'> {
  /** 节点类型 */
  kind: MarkKind.LineCross;
  /** 导线编号 */
  lines: string[];
}

/** 导线节点数据 */
export interface LinePointMark extends BaseMark {
  /** 节点类型 */
  kind: MarkKind.LinePoint;
}

/** 导线数据 */
export interface LineMark extends BaseMark {
  /** 节点类型 */
  kind: MarkKind.Line;
}

/** 器件引脚节点连接导线数据 */
export interface PartPinLineMark extends BaseMark {
  /** 节点类型 */
  kind: MarkKind.PartPinLine;
  /** 引脚编号 */
  pin: number;
  /** 导线编号 */
  line: string;
}

/** 器件节点数据 */
export interface PartMark extends Omit<BaseMark, 'connection'> {
  /** 节点类型 */
  kind: MarkKind.Part;
}

/** 器件空引脚节点数据 */
export interface PartPinMark extends Omit<BaseMark, 'connection'> {
  /** 节点类型 */
  kind: MarkKind.PartPin;
  /** 引脚编号 */
  pin: number;
}

/** 导线节点和导线节点 */
export type LineAndLineMark
  = | LineMark
    | LinePointMark
    | LineCoverMark
    | LineCrossMark;

/** 导线节点 */
export type LineAndPointMark
  = | LineAndLineMark
    | PartPinLineMark;

/** 连接点 */
export type ConnectionPointMark
  = | LinePointMark
    | PartPinMark
    | PartPinLineMark
    | LinePointMark
    | LineCrossMark;

/** 节点集合 */
export type Mark = LineAndPointMark | PartAndPinMark;

/** 器件节点 */
export type PartAndPinMark = PartMark | PartPinMark;

/** 图纸服务核心方法 */
export interface IMapHashCoreService {
  /** 获取所有标记 */
  getAllMarks(): Mark[];
  /** 清除所有标记 */
  clearAll(): void;
  /** 标记是否存在 */
  has(position: Point): boolean;
  /** 获取标记 */
  get(position: Point): Mark | undefined;
  /** 设置标记 */
  set(data: Mark): void;
  /** 删除标记 */
  delete(position: Point): void;
}

/** 图纸服务断言方法 */
export interface IMapHashAssertService {
  /** 导线断言 */
  isLine(mark: unknown): mark is LineMark;
  /** 导线节点断言 */
  isLinePoint(mark: unknown): mark is LinePointMark;
  /** 交错节点断言 */
  isLineCross(mark: unknown): mark is LineCrossMark;
  /** 交叠节点断言 */
  isLineCover(mark: unknown): mark is LineCoverMark;
  /** 器件节点断言 */
  isPart(mark: unknown): mark is PartMark;
  /** 器件空引脚节点断言 */
  isPartPin(mark: unknown): mark is PartPinMark;
  /** 器件引脚节点连接导线断言 */
  isPartPinLine(mark: unknown): mark is PartPinLineMark;
  /** 导线节点和器件节点断言 */
  isLineAndPoint(mark: unknown): mark is LineAndPointMark;
  /** 全导线节点断言 */
  isLineAndLine(mark: unknown): mark is LineAndLineMark;
  /** 器件节点和器件空引脚节点断言 */
  isPartAndPin(mark: unknown): mark is PartAndPinMark;
}

/** 图纸服务业务方法 */
export interface IMapHashBusinessService {
  /** 从初始数据创建图纸记录 */
  createFromData(data: StructuredData): void;
  /** 设置标记 */
  setMark(data: PartStructuredData | LineStructuredData): void;
  /** 删除器件标记 */
  removeMark(data: PartStructuredData | LineStructuredData): void;
}

/** 图纸服务标记数据方法 */
export interface IMapHashMarkService {
  /** 是否包含导线 */
  hasLine(data: LineAndPointMark, line: string): boolean;
  /** 是否包含连接 */
  hasConnect(data: LineAndPointMark, next: Point): boolean;
  /** 是否包含直线通路 */
  hasStraightLine(data: LineAndPointMark): boolean;
  /** 是否全交叉 */
  isFullCross(data: LineCrossMark): boolean;
  /** 是否无连接 */
  isNoConnect(data: Mark): boolean;
  /** 前后位置和当前节点是否连通 */
  inStraightLine(data: LineCoverMark, next: Point, pre: Point): boolean;
  /**
   * 沿着导线前进
   *
   * @description 会排除器件引脚
   */
  alongLineAndVector(data: LineAndLineMark, vector: Point, end?: Point): LineAndLineMark;
}

/** 图纸服务 */
export interface IMapHashService extends
  IMapHashCoreService,
  IMapHashAssertService,
  IMapHashBusinessService,
  IMapHashMarkService
{}
