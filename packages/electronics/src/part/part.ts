import { Electronic } from '../base';
import { Electronics } from './prototype';
import { ElectronicKind, Context } from '../types';
import { isNumber } from '@xiao-ai/utils';
import { getMarginVertex } from './utils';
import { Matrix, Point, Direction, Directions } from '@circuit/math';

import {
  PartData,
  MarginDirection,
  ElectronicPrototype,
  PartPinStatus,
  PartStructuredData,
} from './types';

export class Part extends Electronic {
  #position: Point;
  #rotate = new Matrix(2, 'E');
  #invRotate = new Matrix(2, 'E');
  #points: PartPinStatus[] = [];
  #params: string[] = [];
  #texts: string[] = [];

  constructor(kind: ElectronicKind | PartData, context?: Context) {
    super(kind, context);

    const { prototype } = this;
    const data: Partial<Omit<PartData, 'kind'>> = !isNumber(kind) ? kind : {};

    this.#params = data.params ?? prototype.params.map((n) => n.default);
    this.#rotate = data.rotate ? Matrix.from(data.rotate) : new Matrix(2, 'E');
    this.#position = data.position ? Point.from(data.position) : new Point(1e6, 1e6);
    // this.textPlacement = data.text ? Direction[data.text] : Direction.Bottom;

    this.#updateRotate();
    this.#updatePoints();
    this.#updateTexts();
  }

  /** 器件原型数据 */
  get prototype(): ElectronicPrototype {
    return Electronics[this.kind];
  }
  /** 原件类别 */
  get kindName() {
    return ElectronicKind[this.kind];
  }
  /** 旋转矩阵 */
  get rotate() {
    return this.#rotate;
  }
  set rotate(val: Matrix) {
    this.#rotate = val;
    this.#updateRotate();
    this.#updatePoints();
  }
  /** 器件中心坐标 */
  get position() {
    return Point.from(this.#position);
  }
  set position(val: Point) {
    this.#position = val;
    this.#updatePoints();
  }
  /** 旋转逆矩阵 */
  get invRotate() {
    return this.#invRotate;
  }
  /** 器件外边距 */
  get margin() {
    return getMarginVertex(this.position, this.prototype.margin, this.rotate);
  }
  /** 器件内边距 */
  get padding() {
    return getMarginVertex(this.position, this.prototype.padding, this.rotate);
  }
  /** 引脚状态 */
  get points() {
    return this.#points.slice();
  }
  /** 参数描述 */
  get params() {
    return this.#params;
  }
  set params(val: string[]) {
    this.#params = val;
    this.#updateTexts();
  }
  /** 参数文本 */
  get texts() {
    return this.#texts;
  }

  /** 更新旋转矩阵 */
  #updateRotate() {
    this.#invRotate = this.#rotate.inverse();
  }
  /** 更新引脚数据 */
  #updatePoints() {
    const { prototype, rotate, connections } = this;
    const points = this.#points;
    const position = this.#position;

    for (let i = 0; i < prototype.points.length; i++) {
      const point = prototype.points[i];
      const oldPoint = points[i];
      const newPoint: PartPinStatus = {
        index: i,
        status: connections[i].status,
        origin: Point.from(point.position),
        position: Point.prototype.rotate.call(point.position, rotate).add(position),
        direction: Point.prototype.rotate.call(Directions[point.direction], rotate),
        ui: oldPoint?.ui ?? {
          size: -1,
          className: '',
        },
      };

      points[i] = newPoint;
    }
  }
  /** 更新说明文本 */
  #updateTexts() {
    this.#texts = this.params
      .map((v, i) => ({ ...Electronics[this.kind].params[i], value: v }))
      .filter((txt) => txt.vision)
      .map((txt) => `${txt.value}${txt.unit}`.replace(/u/g, 'μ'));
  }
  /** 迭代器件内边距节点 */
  *#getPaddingPoint() {
    const [point1, point2, point3, point4] = this.padding;

    for (const pointY of point1.toDestination(point4, 20)) {
      const numberY = pointY[1];
      const start = new Point(point1[0], numberY);
      const end = new Point(point2[0], numberY);

      for (const point of start.toDestination(end, 20)) {
        yield point;
      }
    }
  }

  /** 设置标志位 */
  setMark() {
    const { id, map, points } = this;

    for (const point of this.#getPaddingPoint()) {
      map.setPartMark(point, id);
    }

    for (let i = 0; i < points.length; i++) {
      map.setPartMark(points[i].position, id, i);
    }
  }
  /** 删除标记 */
  deleteMark() {
    const { map, points } = this;

    for (const point of this.#getPaddingPoint()) {
      map.deletePartMark(point);
    }

    for (const point of points) {
      map.deletePartMark(point.position);
    }
  }
  /**
   * 是否被占用
   *
   * @description 器件范围内没有任何坐标被占用
   * @param {Point} movement 当前元件坐标偏移量
   */
  isOccupied(movement = Point.from([0, 0])) {
    const { id, map, points } = this;

    for (const point of this.#getPaddingPoint()) {
      if (map.has(point.add(movement))) {
        return true;
      }
    }

    for (const { position: point } of this.points) {
      if (map.has(point.add(movement))) {
        return true;
      }
    }

    return false;
  }

  // /** 输出数据 */
  // toData(): Required<PartData> {
  //   return {
  //     id: this.id,
  //     kind: ElectronicKind[this.kind] as keyof typeof ElectronicKind,
  //     position: this.position.toData(),
  //     rotate: this.rotate.toData(),
  //     text: Direction[this.textPlacement] as keyof typeof Direction,
  //     params: this.params.slice(),
  //   };
  // }

  /** 输出数据 */
  toStructuredData(): PartStructuredData {
    return {
      id: this.id,
      kind: this.kind,
      position: this.position.toData(),
      rotate: this.rotate.toData(),
      params: this.params.slice(),
      textPosition: Direction.Bottom,
      // 器件引脚只可能连接一个导线，所以这里取下标 0 的数据即可
      connections: this.connections.map((item) => item[0]),
    };
  }
}
