import type { ConnectionData } from '../base';
import type { ElectronicKind, BasePinStatus } from '../types';

/** 导线原始数据 */
export interface LineData {
  kind: keyof typeof ElectronicKind;
  path: number[][];
}

/** 导线结构化数据 */
export interface LineStructuredData {
  id: string;
  path: [number, number][];
  kind: ElectronicKind.Line;
  connections: ConnectionData[][];
}

/** 导线引脚状态 */
// eslint-disable-next-line
export interface LinePinStatus extends BasePinStatus {
  // ..
}

/** 导线端点 */
export const enum LinePin {
  Start,
  End,
  Middle,
  None,
}
