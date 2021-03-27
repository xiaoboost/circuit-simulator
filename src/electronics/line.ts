import { Electronic } from './base';
import { Point } from 'src/math';
import { LineWay } from './line-way';
import { ElectronicKind, LineData, Connect } from './types';

export class Line extends Electronic implements LineData {
  /** 路径数据 */
  paths: LineWay = new LineWay();
  /** 连接点 */
  connects: Connect[] = [];

  get start() {
    return this.paths.get(0);
  }
  
  get end() {
    return this.paths.get(-1);
  }
}
