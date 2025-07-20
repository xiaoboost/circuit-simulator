import { Point } from '@circuit/algorithm';
import { ConnectionData } from '../connection';

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
