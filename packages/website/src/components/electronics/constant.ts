/** 节点类型 */
export enum PointKind {
  Part,
  Line,
  LineCross,
}

/** 节点状态 */
export enum PointStatus {
  Open,
  Close,
}

/** 导线接触方块大小 */
export interface RectSize {
  x: number;
  y: number;
  height: number;
  width: number;
}

/** 导线接触方块宽度 */
export const rectWidth = 14;
/** 文本行高 */
export const textHeight = 14;
/** 文本行间距 */
export const textSpaceHeight = 2;
