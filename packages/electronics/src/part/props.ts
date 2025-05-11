import { Point, RotateMatrix, DirectionVectorSet, invertRotateMatrix } from '@circuit/algorithm';
import { isNumber } from '@xiao-ai/utils';
import { SheetContext, Electronic } from '../base';
import { ElectronicKind } from '../types';
import { Electronics } from './prototype';
import { PartData, ElectronicPrototype, PartPinStatus } from './types';
import { getMarginVertex } from './utils';

export abstract class PartProps extends Electronic {
  #position: Point;
  #rotate: RotateMatrix = [[1, 0], [0, 1]];
  #invRotate: RotateMatrix = [[1, 0], [0, 1]];
  #points: PartPinStatus[] = [];
  #params: string[] = [];
  #texts: string[] = [];

  #textNeedUpdate = false;
  #pointsNeedUpdate = false;
  #invRotateNeedUpdate = false;

  constructor(kind: ElectronicKind | PartData, context?: SheetContext) {
    super(kind, context);

    const { prototype } = this;
    const data: Partial<Omit<PartData, 'kind'>> = !isNumber(kind) ? kind : {};

    this.#params = data.params ?? prototype.params.map((n) => n.default);
    this.#rotate = data.rotate ?? [[1, 0], [0, 1]];
    this.#position = data.position ? Point.from(data.position) : new Point(1e6, 1e6);

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
    return invertRotateMatrix(this.#rotate);
  }
  set rotate(val: RotateMatrix) {
    this.#pointsNeedUpdate = true;
    this.#invRotateNeedUpdate = true;
    this.#rotate = val;
  }
  /** 器件中心坐标 */
  get position() {
    return Point.from(this.#position);
  }
  set position(val: Point) {
    this.#pointsNeedUpdate = true;
    this.#position = val;
  }
  /** 旋转逆矩阵 */
  get invRotate() {
    if (this.#invRotateNeedUpdate) {
      this.#updateRotate();
      this.#invRotateNeedUpdate = false;
    }

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
    if (this.#pointsNeedUpdate) {
      this.#updatePoints();
      this.#pointsNeedUpdate = false;
    }

    return this.#points.slice();
  }
  /** 参数描述 */
  get params() {
    return this.#params;
  }
  set params(val: string[]) {
    this.#params = val;
    this.#textNeedUpdate = true;
  }
  /** 参数文本 */
  get texts() {
    if (this.#textNeedUpdate) {
      this.#updateTexts();
      this.#textNeedUpdate = false;
    }

    return this.#texts;
  }

  /** 更新旋转矩阵 */
  #updateRotate() {
    this.#invRotate = invertRotateMatrix(this.#rotate);
  }
  /** 更新引脚数据 */
  #updatePoints() {
    const { prototype, rotate, connections } = this;
    const points = this.#points;
    const position = this.#position;

    for (let i = 0; i < prototype.pins.length; i++) {
      const point = prototype.pins[i];
      const oldPoint = points[i];
      const newPoint: PartPinStatus = {
        index: i,
        status: connections[i].status,
        origin: Point.from(point.position),
        position: Point.prototype.rotate.call(point.position, rotate).add(position),
        direction: Point.prototype.rotate.call(DirectionVectorSet[point.direction], rotate),
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
      .filter((txt) => txt.visible)
      .map((txt) => `${txt.value}${txt.unit}`.replace(/u/g, 'μ'));
  }
}
