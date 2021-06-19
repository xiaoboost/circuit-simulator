import { PointLike } from '@circuit/math';

/** 节点类型常量 */
export enum MarkNodeKind {
  /** 导线 */
  Line = 10,
  /** 导线空节点 */
  LineSpacePoint,
  /** 导线交叠节点（实际并不相交） */
  LineCoverPoint,
  /** 导线交错节点 */
  LineCrossPoint,

  /** 器件节点 */
  Part = 20,
  /** 器件引脚节点 */
  PartPin,

  /** 空白 */
  Space = 30,
}

/** 节点标志数据 */
export interface MarkNodeLabel {
  id: string;
  mark: number;
}

/** 节点输入数据 */
export interface NodeInputData {
  id: string;
  mark?: number;
  position: PointLike;
  connections?: PointLike[];
}

/** 结构化数据 */
export interface MarkNodeStructuredData {
  labels: MarkNodeLabel[];
  kind: keyof typeof MarkNodeKind;
  position: [number, number];
  connections: [number, number][];
}
