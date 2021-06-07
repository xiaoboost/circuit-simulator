import { Electronic } from '../base';
import { LinePath } from './path';
import { LineData, LinePinStatus } from './types';
import { ElectronicKind } from '../types';
import { PointLike } from '@circuit/math';

export * from './types';
export * from './path';

export class Line extends Electronic {
  constructor(paths: PointLike[] = []) {
    super(ElectronicKind.Line);
    this.path = LinePath.from(paths);
  }

  private _path!: LinePath;
  /** 导线引脚状态 */
  private _points: LinePinStatus[] = [];

  /** 导线路径 */
  get path() {
    return this._path;
  }
  set path(val: LinePath) {
    this._path = val;
    this.updatePoints();
  }
  get points() {
    return this._points;
  }

  private updatePoints() {
    if (this.path.length === 0) {
      this._points = [];
    }

    for (let i = 0; i < 2; i++) {
      const position = this.path[i * (this.path.length - 1)];
      const oldData = this.points[i];

      this.points[i] = {
        label: `${this.id}_${i}`,
        isConnected: Boolean(this.connects[i]),
        position,
      };

      if (oldData?.size) {
        this.points[i].size = oldData.size;
      }

      if (oldData?.className) {
        this.points[i].className = oldData.className;
      }
    }
  }

  /** 设置标志位 */
  setMark() {
    // ..
  }

  /** 删除标记 */
  deleteMark() {
    // ..
  }

  /** 导线反转 */
  reverse() {
    this.path.reverse();
    this.connects.reverse();
  }

  /** 输出数据 */
  toData(): Required<LineData> {
    return {
      kind: 'Line',
      path: this.path.toData(),
    };
  }
}
