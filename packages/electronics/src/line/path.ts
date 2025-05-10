import { Point, PointLike } from '@circuit/algorithm';
import { LinePin } from './types';

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
   * 去除冗余节点
   *
   * @description 相邻三点共线或者相邻两点相等
   */
  removeRedundantNodes() {
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
   * 获取线段的方向
   *
   * @description 输入负数时表示反方向，且`-1`表示最后的线段
   */
  getSegmentVector(index: number) {
    if (index >= 0) {
      if (index >= this.length - 1) {
        throw new Error(`求线段方向时超过了线条长度，线条长度：${this.length}，当前输入为：${index}。`);
      }

      return new Point(this[index], this[index + 1]).sign().mul(20);
    }
    else {
      if (index <= -this.length) {
        throw new Error(`求线段方向时超过了线条长度，线条长度：${this.length}，当前输入为：${index}。`);
      }

      return new Point(this[this.length - index], this[this.length - index - 1]).sign().mul(20);
    }
  }

  /**
   * 导线形状相似
   *
   * @description 节点数量相同，有且仅有最后一段线段平行，其余全部相等
   * @description 导线只有一个节点时，返回`true`
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

    const selfSegment = this.getSegmentVector(this.length - 2);
    const inputSegment = line.getSegmentVector(this.length - 2);

    return selfSegment.isParallel(inputSegment);
  }

  /**
   * 端点指向某座标
   *
   * @description 导线节点数量少于`1`则忽略
   */
  setEndPointTo(node: Point, pin: LinePin = LinePin.End): this {
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
      throw new Error('错误的指向模式');
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
   * 端点指向某线段
   *
   * @description 导线节点数量少于`3`则忽略
   * @description 输入线段必定与`this`平行
   */
  setEndPointOntoLine(segment: PointLike[], mouse: Point): this {
    if (this.length < 3) {
      return this;
    }

    const byMouse = segment[0][0] === segment[1][0] ? 1 : 0;

    this.get(-2)[byMouse] = mouse[byMouse];
    this.get(-1)[byMouse] = mouse[byMouse];

    return this;
  }
}
