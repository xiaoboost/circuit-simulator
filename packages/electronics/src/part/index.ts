import { Electronic } from '../base';
import { Electronics } from './prototype';
import { ElectronicKind } from '../types';
import { PartData, MarginDirection, ElectronicPrototype, PartPinStatus } from './types';
import { Matrix, Point, Direction, Directions } from '@circuit/math';
import { isNumber } from '@xiao-ai/utils';

export * from './types';
export * from './prototype';

export class Part extends Electronic {
  /** 位置坐标 */
  position: Point;
  /** 说明文本方向 */
  textPlacement = Direction.Bottom;

  constructor(kind: ElectronicKind | PartData) {
    super(kind);

    const { prototype } = this;
    const data: Partial<Omit<PartData, 'kind'>> = !isNumber(kind) ? kind : {};

    this.params = data.params ?? prototype.params.map((n) => n.default);
    this.rotate = data.rotate ? Matrix.from(data.rotate) : new Matrix(2, 'E');
    this.position = data.position ? Point.from(data.position) : new Point(1e6, 1e6);
    this.textPlacement = data.text ? Direction[data.text] : Direction.Bottom;
  }

  private _rotate = new Matrix(2, 'E');
  private _invRotate = new Matrix(2, 'E');
  private _points: PartPinStatus[] = [];
  private _params: string[] = [];
  private _texts: string[] = [];
  private _margin = {
    margin: [0, 0, 0, 0] as const,
    padding: [0, 0, 0, 0] as const,
  };

  /** 器件原型数据 */
  get prototype(): ElectronicPrototype {
    return Electronics[this.kind];
  }

  /** 旋转矩阵 */
  get rotate() {
    return this._rotate;
  }
  set rotate(val: Matrix) {
    this._rotate = val;
    this.updateRotate();
    this.updateMargin();
    this.updatePoints();
  }
  /** 旋转逆矩阵 */
  get invRotate() {
    return this._invRotate;
  }
  /** 器件边距 */
  get margin() {
    return this._margin;
  }
  /** 引脚状态 */
  get points() {
    return this._points;
  }
  /** 参数描述 */
  get params() {
    return this._params;
  }
  set params(val: string[]) {
    this._params = val;
    this.updateTexts();
  }
  /** 参数文本 */
  get texts() {
    return this._texts;
  }

  protected updateMargin() {
    const { prototype, rotate } = this;

    [Direction.Top, Direction.Right, Direction.Bottom, Direction.Left]
      .map((item) => Directions[item].rotate(rotate))
      .forEach((vector, i) => {
        const index = MarginDirection[vector.toDirection()];
        const paddingLen = Math.abs(vector.product([1, 1])) * 20 * prototype.padding[i];
        const marginLen = Math.abs(vector.product([1, 1])) * 20 * prototype.margin[i];
        (this._margin.margin as any)[index] = marginLen;
        (this._margin.padding as any)[index] = paddingLen;
      });

    this.updateView();
  }
  protected updateRotate() {
    this._invRotate = this._rotate.inverse();
    this.updateView();
  }
  protected updatePoints() {
    const { prototype, rotate } = this;

    for (let i = 0; i < prototype.points.length; i++) {
      const point = prototype.points[i];
      const current = this.points[i];

      this.points[i] = {
        index: i,
        isConnected: Boolean(this.connections[i].value),
        origin: Point.from(point.position),
        position: Point.prototype.rotate.call(point.position, rotate),
        direction: Point.prototype.rotate.call(Directions[point.direction], rotate),
      };

      if (current?.size) {
        this.points[i].size = current.size;
      }

      if (current?.className) {
        this.points[i].className = current.className;
      }
    }

    this.updateView();
  }
  protected updateTexts() {
    this._texts = this.params
      .map((v, i) => ({ ...Electronics[this.kind].params[i], value: v }))
      .filter((txt) => txt.vision)
      .map((txt) => `${txt.value}${txt.unit}`.replace(/u/g, 'μ'));

    this.updateView();
  }

  /** 迭代器件当前覆盖的所有节点 */
  *padding() {
    const { prototype, position, rotate } = this;
    const boxSize = prototype.padding;
    const endPoint = [[-boxSize[3], -boxSize[0]], [boxSize[1], boxSize[2]]];
    const data = endPoint.map((point) => Point.prototype.rotate.call(point, rotate).mul(20));
    const padding = [
      [
        Math.min(data[0][0], data[1][0]),
        Math.min(data[0][1], data[1][1]),
      ],
      [
        Math.max(data[0][0], data[1][0]),
        Math.max(data[0][1], data[1][1]),
      ],
    ];

    for (let x = position[0] + padding[0][0]; x <= position[0] + padding[1][0]; x+=20) {
      for (let y = position[1] + padding[0][1]; y <= position[1] + padding[1][1]; y+=20) {
        yield new Point(x, y);
      }
    }
  }

  /** 设置标志位 */
  setMark() {
    for (const point of this.padding()) {
      this.map.set({
        id: this.id,
        position: point,
      });
    }

    for (let i = 0; i < this.points.length; i++) {
      this.map.set({
        id: this.id,
        mark: i,
        position: this.points[i].position.add(this.position),
      });
    }
  }

  /** 删除标记 */
  deleteMark() {
    for (const point of this.padding()) {
      this.map.delete(point);
    }

    for (const point of this.points) {
      this.map.delete(point.position.add(this.position));
    }
  }

  /** 是否被占用 */
  isOccupied(location = this.position) {
    return false;
  }

  /** 输出数据 */
  toData(): Required<PartData> {
    return {
      id: this.id,
      kind: ElectronicKind[this.kind] as keyof typeof ElectronicKind,
      position: this.position.toData(),
      rotate: this.rotate.toData(),
      text: Direction[this.textPlacement] as keyof typeof Direction,
      params: this.params.slice(),
    };
  }
}
