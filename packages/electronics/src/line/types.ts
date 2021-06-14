import type { ElectronicKind } from '../types';
import type { Point } from '@circuit/math';

/** 导线原始数据 */
export interface LineData {
  kind: keyof typeof ElectronicKind;
  path: number[][];
}

/** 导线引脚状态 */
export interface LinePinStatus {
  /** 节点半径 */
  size?: number;
  /** 节点样式名称 */
  className?: string;
  /** 引脚下标 */
  index: number;
  /** 节点是否连接着器件 */
  isConnected: boolean;
  /** 现在节点相对图纸原点位置 */
  position: Point;
}

/** 导线断点 */
export const enum LinePin {
  Start,
  End,
  Middle,
  None,
}
