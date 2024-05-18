/** 节点种类 */
export enum ElectronicPointKind {
  /** 器件空引脚 */
  PartPin,
  /** 器件连接导线引脚 */
  PartPinLine,
  /** 导线空引脚 */
  Line,
  /** 导线交错节点 */
  LineCross,
  /** 导线交叠节点 */
  LineCover,
}

/** 导线接触方块大小 */
export interface RectSize {
  x: number;
  y: number;
  height: number;
  width: number;
}
