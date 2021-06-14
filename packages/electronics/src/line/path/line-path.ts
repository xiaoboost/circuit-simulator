import { Point, PointLike } from '@circuit/math';
import { LinePin } from '../types';

/** 导线路径类 */
export class LinePath extends Array<Point> {
  static from(points: Point[] | PointLike[]) {
    const way = new LinePath(points.length);

    for (let i = 0; i < points.length; i++) {
      way[i] = Point.from(points[i]);
    }

    return way;
  }

  constructor(len = 0) {
    super(len);
  }

  /** 转换为 path 路径 */
  stringify() {
    return this.length === 0 ? '' : `M${this.map((n) => n.join(',')).join('L')}`;
  }

  /** 输出数据 */
  toData() {
    const result: [number, number][] = [];

    /**
     * 这里不直接用 this.map 主要是因为 this.map 出来还是 LinePath 类，
     * 但是这里我们需要的是个纯数组
     */

    for (let i = 0; i < this.length; i++) {
      result.push(this[i].toData());
    }

    return result;
  }

  /** 获取节点 */
  get(index: number) {
    const sub = (index >= 0) ? index : this.length + index;

    if (sub < 0 || sub >= this.length) {
      throw new Error('(lineway) index out of bounds.');
    }

    return this[sub];
  }

  /** 导线节点坐标标准化 */
  standardize(base = 20) {
    for (let i = 0; i < this.length; i++) {
      this[i] = this[i].round(base);
    }

    return this;
  }

  /** 导线坐标整体偏移 */
  move(bias: PointLike = [0, 0]) {
    for (let i = 0; i < this.length; i++) {
      this[i] = this[i].add(bias);
    }

    return this;
  }

  /**
   * 去除节点冗余
   *  - 相邻三点共线或者相邻两点相等
   */
  removeRepeat() {
    for (let i = 0; i < this.length - 2; i++) {
      if (
        ((this[i][0] === this[i + 1][0]) && (this[i + 1][0] === this[i + 2][0])) ||
        ((this[i][1] === this[i + 1][1]) && (this[i + 1][1] === this[i + 2][1])) ||
        ((this[i][0] === this[i + 1][0]) && (this[i][1] === this[i + 1][1]))
      ) {
        this.splice(i + 1, 1);
        i -= 2;

        if (i < -1) {
          i = -1;
        }
      }
    }

    return this;
  }

  /**
   * 导线形状相似
   *  - 节点数量相同
   *  - 只有最后两个节点不同
   *  - 最后两个节点组成的线段平行
   */
  isSimilar(line: LinePath) {
    if (this.length !== line.length) {
      return false;
    }

    if (this.length < 2) {
      return true;
    }

    for (let i = 0; i < this.length - 2; i++) {
      if (!this[i].isEqual(line[i])) {
        return false;
      }
    }

    const selfSegment = new Point(this.get(-1), this.get(-2));
    const inputSegment = new Point(line.get(-1), line.get(-2));

    return selfSegment.isParallel(inputSegment);
  }

  /** 获取当前线段的方向 */
  getSubVector(index: number) {
    return new Point(this[index], this[index + 1]).sign().mul(20);
  }

  /**
   * 终点（起点）指向某点
   *  - 导线节点数量少于`1`则忽略
   */
  endToPoint(node: Point, pin: LinePin = LinePin.End): this {
    if (this.length <= 1) {
      return this;
    }

    let last, prev;
    if (pin === LinePin.End) {
      last = this.length - 1;
      prev = this.length - 2;
    }
    else if (pin === LinePin.Start) {
      last = 0;
      prev = 1;
    }
    else {
      throw new Error('LinePath: Illegal mode');
    }

    if (this[last][0] === this[prev][0]) {
      this[prev][0] = node[0];
    }
    else {
      this[prev][1] = node[1];
    }
    this[last] = Point.from(node);

    return this;
  }

  /**
   * 终点（起点）指向某线段
   *  - 导线节点数量少于`3`则忽略
   *  - 输入线段必定与`this`平行
   */
  endToLine(segment: Point[] | number[][], mouse: Point): this {
    if (this.length < 3) {
      return this;
    }

    const byMouse = segment[0][0] === segment[1][0] ? 1 : 0;

    this.get(-2)[byMouse] = mouse[byMouse];
    this.get(-1)[byMouse] = mouse[byMouse];

    return this;
  }

  /** 迭代每个节点 */
  *forEachPoint() {
    let index = 0;
    let node = Point.from(this[0]);
    let vector = this.getSubVector(0);

    while (!node.isEqual(this.get(-1))) {
      yield node;

      node = node.add(vector);

      if (
        index < this.length - 2 &&
        node.isEqual(this[index + 1])
      ) {
        index++;
        vector = this.getSubVector(index);
      }
    }

    yield node;
  }
}
