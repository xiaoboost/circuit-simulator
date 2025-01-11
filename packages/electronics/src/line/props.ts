
import { PointLike } from '@circuit/math';
import { Electronic, SheetContext } from '../base';
import { ElectronicKind } from '../types';
import { LinePath } from './path';
import { LinePinStatus } from './types';

export class LineProps extends Electronic {
  constructor(paths: PointLike[] = [], context?: SheetContext) {
    super(ElectronicKind.Line, context);
    this.#path = LinePath.from(paths);
  }

  #path: LinePath;
  #points: LinePinStatus[] = [];

  #pointsNeedUpdate = false;

  /** 导线路径 */
  get path() {
    return LinePath.from(this.#path);
  }
  set path(val: LinePath) {
    this.#path = val;
    this.#pointsNeedUpdate = true;
  }
  /** 导线引脚状态 */
  get points() {
    if (this.#pointsNeedUpdate) {
      this.#updatePoints();
      this.#pointsNeedUpdate = false;
    }

    return this.#points.slice();
  }

  #updatePoints() {
    const { connections } = this;
    const path = this.#path;
    const points = this.#points;

    if (path.length === 0) {
      points.length = 0;
      return;
    }

    for (let i = 0; i < 2; i++) {
      const oldPoint = points[i];
      const newPoint: LinePinStatus = {
        index: i,
        position: path[i * (path.length - 1)],
        status: connections[i].status,
        ui: oldPoint?.ui ?? {
          size: -1,
          className: '',
        },
      };

      points[i] = newPoint;
    }
  }
}
