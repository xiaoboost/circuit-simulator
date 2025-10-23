import { PathSearcherOptions } from '../algorithm';

export interface DrawLineSearcherOptions extends PathSearcherOptions {
  /** 当前导线编号 */
  lineId: string;
}
