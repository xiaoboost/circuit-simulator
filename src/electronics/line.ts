import { Electronic } from './base';
import { Point } from 'src/math';
import { LineWay } from './line-way';
import { ElectronicKind, LineData } from './constant';

export class Line extends Electronic implements LineData {
  /** 路径数据 */
  path: LineWay = new LineWay();

  constructor() {
    super(ElectronicKind.Line);
  }

  get start() {
    return this.path.get(0);
  }

  get end() {
    return this.path.get(-1);
  }
}
