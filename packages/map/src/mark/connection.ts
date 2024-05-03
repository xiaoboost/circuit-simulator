import { Point } from '@circuit/math';

export class Connection {
  /** 标识符 */
  readonly id?: string;
  /** 基准坐标 */
  readonly point: Point;

  /** 左侧连通性 */
  left?: boolean;
  /** 右侧连通性 */
  right?: boolean;
  /** 上侧连通性 */
  top?: boolean;
  /** 下侧连通性 */
  bottom?: boolean;

  constructor(point: Point, id?: string) {
    this.id = id;
    this.point = point;
  }

  /**
   * 全连接
   *
   * @description 无法再连接别的节点
   */
  get isFull() {
    return Boolean(this.left && this.right && this.top && this.bottom);
  }

  private vectorToKey(vector: Point) {
    if (process.env.NODE_ENV === 'development') {
      if (!vector.isAxis()) {
        throw new Error('连接器向量必须是轴向量');
      }
    }

    if (vector[0] > 0 && vector[1] === 0) {
      return 'right';
    }
    else if (vector[0] < 0 && vector[1] === 0) {
      return 'left';
    }
    else if (vector[0] === 0 && vector[1] > 0) {
      return 'bottom';
    }
    else {
      return 'top';
    }
  }

  add(point: Point) {
    return this.addVector(point.add(this.point, -1));
  }

  delete(point: Point) {
    return this.deleteVector(point.add(this.point, -1));
  }

  has(point: Point) {
    return this.hasVector(point.add(this.point, -1));
  }

  addVector(vector: Point) {
    this[this.vectorToKey(vector)] = true;
  }

  deleteVector(vector: Point) {
    this[this.vectorToKey(vector)] = false;
  }

  hasVector(vector: Point) {
    return Boolean(this[this.vectorToKey(vector)]);
  }

  getPoints() {
    return (['top', 'right', 'bottom', 'left'] as const)
      .map((key) => ({ key, val: this[key] }))
      .filter(({ val }) => Boolean(val))
      .map(({ key }) => {
        switch (key) {
          case 'left': {
            return this.point.add([-20, 0]);
          }
          case 'right': {
            return this.point.add([20, 0]);
          }
          case 'top': {
            return this.point.add([0, -20]);
          }
          case 'bottom': {
            return this.point.add([0, 20]);
          }
        }
      });
  }

  fromData(data: number[] = []) {
    [this.top, this.right, this.bottom, this.left] = data.map((item) => item === 1);
  }

  toData() {
    return [this.top, this.right, this.bottom, this.left].map((item) => Number(Boolean(item)));
  }
}
