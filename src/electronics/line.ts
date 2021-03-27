import { Electronic } from './base';
import { Point } from 'src/math';
import { LineWay } from './line-way';
import { ElectronicKind, LineData, Content } from './types';

export class Line extends Electronic implements LineData {
  /** 路径数据 */
  paths: LineWay = new LineWay();
  /** 连接点 */
  contents: Content[] = [];

  get start() {
    return this.paths.get(0);
  }
  
  get end() {
    return this.paths.get(-1);
  }
}
