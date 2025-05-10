import { Point } from '@circuit/algorithm';

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

  #vectorToKey(vector: Point) {
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
    this[this.#vectorToKey(vector)] = true;
  }

  deleteVector(vector: Point) {
    this[this.#vectorToKey(vector)] = false;
  }

  hasVector(vector: Point) {
    return Boolean(this[this.#vectorToKey(vector)]);
  }

  /**
   * 迭代连接的点:
   *
   * @description 顺序为：上右下左
   */
  getConnectedPoints(): (Point | undefined)[] {
    return [
      this.top ? this.point.add([0, -20]) : undefined,
      this.right ? this.point.add([20, 0]) : undefined,
      this.bottom ? this.point.add([0, 20]) : undefined,
      this.left ? this.point.add([-20, 0]) : undefined,
    ];
  }

  fromData(data: number[] = []) {
    [this.top, this.right, this.bottom, this.left] = data.map((item) => item === 1);
  }

  toData() {
    return [this.top, this.right, this.bottom, this.left].map((item) => item ? 1 : 0);
  }
}
