import { Electronic } from './base';
import { LineWay } from './line-way';
import { ElectronicKind, LineData } from './constant';

export class Line extends Electronic implements LineData {
  /** 路径数据 */
  path: LineWay = new LineWay();
  /** 正在变换形状 */
  inDrawStatus = false;

  constructor() {
    super(ElectronicKind.Line);
  }
}
