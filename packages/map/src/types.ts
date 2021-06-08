import { Point, PointLike } from '@circuit/math';

/** 节点类型常量 */
export enum MarkNodeKind {
  /** 导线 */
  Line = 10,
  /** 导线空节点 */
  LinePoint,
  /** 导线交叠节点（实际并不相交） */
  LineCoverPoint,
  /** 导线交错节点 */
  LineCrossPoint,

  /** 器件节点 */
  Part = 20,
  /** 器件引脚节点 */
  PartPoint,
}

/** 节点数据 */
export interface MarkNodeData {
  /** 当前点属于哪个元件 */
  label: string;
  /** 节点类型 */
  kind: MarkNodeKind;
  /** 当前点的坐标 */
  position: Point;
  /** 当前点在图纸中连接着另外哪些点 */
  connect: Point[];
  /**
   * 所属元件的引脚编号
   *  - 是`-1`时表示不是引脚
   */
  mark: number;
  /**
   * 此节点为导线交叠节点时，导线的连接关系
   */

}

/** 节点输入数据 */
export interface NodeInputData {
  label: string;
  kind: MarkNodeKind;
  position: PointLike;
  connect?: PointLike[];
  mark?: number;
}
