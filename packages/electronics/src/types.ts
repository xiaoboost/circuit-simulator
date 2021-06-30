import type { Point } from '@circuit/math';
import type { ConnectionStatus } from './utils';
import type { MarkMap } from '@circuit/map';
import type { Part } from './part';
import type { Line } from './line';

export { ElectronicKind } from '@circuit/shared';

/** 引脚数据 */
export interface BasePinStatus {
  /** 节点半径 */
  size?: number;
  /** 节点样式名称 */
  className?: string;
  /** 引脚下标 */
  index: number;
  /** 连接状态 */
  status: ConnectionStatus;
  /** 现在节点相对图纸原点位置 */
  position: Point;
}

/** 器件上下文 */
export interface Context {
  map: MarkMap;
  lines: Line[];
  parts: Part[];
}

/** 鼠标控制元素类名称 */
export const MouseFocusClassName = '_focus-transparent';
