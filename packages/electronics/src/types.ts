import type { Point } from '@circuit/math';
import type { ConnectionStatus } from './utils';
import type { MarkMap } from '@circuit/map';
import type { Part } from './part/part';
import type { Line } from './line/line';

export { ElectronicKind } from '@circuit/shared';

/** 引脚显示状态 */
export interface PinUIStatus {
  /**
   * 节点半径
   *
   * @description `-1`表示不设定大小
   */
  size: number;
  /** 节点样式名称 */
  className: string;
}

/** 引脚数据 */
export interface BasePinStatus {
  /** 引脚下标 */
  index: number;
  /** 连接状态 */
  status: ConnectionStatus;
  /** 引脚相对图纸原点位置 */
  position: Point;
  /** UI 状态 */
  ui: PinUIStatus;
}

/** 器件上下文 */
export interface Context {
  map: MarkMap;
  lines?: Line[];
  parts?: Part[];
}

/** 鼠标控制元素类名称 */
export const MouseFocusClassName = '_focus-transparent';
