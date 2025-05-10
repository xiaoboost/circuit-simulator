import type { PointLike } from '@circuit/algorithm';
import type { LineMark, LineStructureData } from './line';
import type { LineCoverMark, LineCoverStructureData } from './line-cover';
import type { LineCrossMark, LineCrossStructureData } from './line-cross';
import type { LinePointMark, LinePointStructureData } from './line-point';
import type { PartMark, PartStructureData } from './part';
import type { PartPinMark, PartPinStructureData } from './part-pin';
import type { PartPinLineMark, PartPinLineStructureData } from './part-pin-line';

/** 节点构造器集合 */
export type MarkConstructor = MarkConstructorMap[keyof MarkConstructorMap];
/** 节点集合 */
export type Mark = LineAndPointMark | PartAndPinMark;
/** 导线节点 */
export type LineAndPointMark =
  | LineMark
  | LinePointMark
  | LineCoverMark
  | LineCrossMark
  | PartPinLineMark;

/** 器件节点 */
export type PartAndPinMark = PartMark | PartPinMark;

/** 构造器记录 */
export interface MarkConstructorMap {
  LineMark: typeof LineMark;
  LinePointMark: typeof LinePointMark;
  LineCoverMark: typeof LineCoverMark;
  LineCrossMark: typeof LineCrossMark;
  PartMark: typeof PartMark;
  PartPinMark: typeof PartPinMark;
  PartPinLineMark: typeof PartPinLineMark;
}

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

/** 位置数据 */
export type DataWithPosition<T = object> = T & {
  position: PointLike;
};

/**
 * 结构化数据
 *
 * @inner
 */
export type MarkStructureWrapper<T, K extends MarkKind> = T & {
  kind: K;
  position: number[];
};

/** 节点结构化数据 */
export type MarkStructureData =
  | PartStructureData
  | PartPinStructureData
  | PartPinLineStructureData
  | LineStructureData
  | LinePointStructureData
  | LineCoverStructureData
  | LineCrossStructureData;
