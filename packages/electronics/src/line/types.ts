import type { ElectronicKind, BasePinStatus } from '../types';

/** 导线原始数据 */
export interface LineData {
  kind: keyof typeof ElectronicKind;
  path: number[][];
}

/** 导线引脚状态 */
export interface LinePinStatus extends BasePinStatus {
  // ..
}

/** 导线端点 */
export const enum LinePin {
  Start = 0,
  End = 1,
  Middle,
  None,
}
