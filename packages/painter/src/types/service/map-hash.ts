import { Point } from '@circuit/algorithm';
import { PartStructuredData, LineStructuredData } from '@circuit/types';
import { createServiceKey } from '../../context';

/**
 * 图纸服务键
 *
 * @description 图纸服务，该服务主要是提供图纸相关服务，比如元件连接关系等。
 * @example
 * ```ts
 * const mapService = useService(MAP_HASH_SERVICE);
 * ```
 */
export const MAP_HASH_SERVICE =
  createServiceKey<IMapService>('Map');

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

export type MarkMap = Record<string, Mark>;

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

/** 节点集合 */
export type Mark = LineAndPointMark | PartAndPinMark;

/** 导线节点 */
export type LineAndPointMark =
  | LineMark
  | LinePointMark
  | LineCoverMark
  | LineCrossMark
  | PartPinLineMark;

/** 连接点 */
export type ConnectionPointMark =
  | LinePointMark
  | PartPinMark
  | PartPinLineMark
  | LinePointMark
  | LineCrossMark;

/** 器件节点 */
export type PartAndPinMark = PartMark | PartPinMark;

/** 标记图纸服务 */
export interface IMapMarkService {
  /** 检查点是否存在 */
  has(point: Point): boolean;
  /** 获取点对应的标记 */
  get<T extends Mark = Mark>(node: Point): T | undefined
  /** 设置标记 */
  set(mark: Mark): void;
  /** 删除点对应的标记 */
  remove(point: Point): void;
  /** 获取所有标记 */
  entries(): [Point, Mark][];
  /** 标记数据断言 */
  getAssert<T extends MarkKind>(kind: T): (mark: Mark) => mark is Extract<Mark, { kind: T }>;
}

/** 图纸服务 */
export interface IMapService extends IMapMarkService{
  /** 设置器件标记 */
  setPartMark(data: PartStructuredData): void;
  /** 设置导线标记 */
  setLineMark(data: LineStructuredData): void;
  /** 删除器件标记 */
  deletePartMark(data: PartStructuredData): void;
  /** 删除导线标记 */
  deleteLineMark(data: LineStructuredData): void;
  /** 获取所有标记 */
  getAllMarks(): Mark[];
}
