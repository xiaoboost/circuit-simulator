import { Electronic } from './base';
import { Matrix, Point, toDirection } from 'src/math';
import { isNumber } from '@utils/assert';
import { DeepReadonly } from '@utils/types';
import { ElectronicPrototype, Electronics } from './parts';
import { ElectronicKind, PartData, map } from './constant';
import { SignNodeKind } from 'src/lib/map';

export class Part extends Electronic implements PartData {
  /** 旋转坐标 */
  rotate: Matrix;
  /** 位置坐标 */
  position: Point;
  /** 参数描述 */
  params: string[];
  /** 文本位置 */
  textPosition = new Point(0, 0);

  /** 创建标志位 */
  isCreate = false;

  constructor(kind: ElectronicKind | Partial<PartData>) {
    super(isNumber(kind) ? kind : kind.kind!);

    const { prototype } = this;
    const data: Partial<PartData> = !isNumber(kind) ? kind : {
      kind,
    };

    this.params = data.params ?? prototype.params.map((n) => n.default);
    this.rotate = data.rotate ? Matrix.from(data.rotate) : new Matrix(2, 'E');
    this.position = data.position ? Point.from(data.position) : new Point(1e6, 1e6);
  }

  /** 迭代器件当前覆盖的所有节点 */
  private *paddingPoints() {
    const { prototype, position, rotate } = this;
    const boxSize = prototype.padding;
    const endpoint = [[-boxSize[3], -boxSize[0]], [boxSize[1], boxSize[2]]];
    const data = endpoint.map((point) => Point.prototype.rotate.call(point, rotate));
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

    for (let x = position[0] + padding[0][0]; x <= position[0] + padding[1][0]; x++) {
      for (let y = position[1] + padding[0][1]; y <= position[1] + padding[1][1]; y++) {
        yield new Point(x, y);
      }
    }
  }
  
  /** 迭代器件当前所有引脚节点 */
  private *connectPoints() {
    const { prototype, position, rotate } = this;

    for (let i = 0; i < prototype.points.length; i++) {
      const point = prototype.points[i];
      yield {
        label: `${this.id}_${i}`,
        position: Point.prototype.rotate.call(point.position, rotate).add(position),
        direction: Point.prototype.rotate.call(toDirection(point.direction), rotate),
      };
    }
  }

  /** 器件原型数据 */
  get prototype(): DeepReadonly<ElectronicPrototype> {
    return Electronics[this.kind];
  }

  /** 设置标志位 */
  setSign() {
    for (const point of this.paddingPoints()) {
      map.set({
        label: this.id,
        point: point,
        kind: SignNodeKind.Part,
      });
    }

    for (const point of this.connectPoints()) {
      map.set({
        label: this.id,
        point: point.position,
        kind: SignNodeKind.PartPoint,
      });
    }
  }

  /** 删除标记 */
  deleteSign() {
    for (const point of this.paddingPoints()) {
      map.delete(point);
    }
    for (const point of this.connectPoints()) {
      map.delete(point.position);
    }
  }

  /** 是否被占用 */
  isOccupied(location = this.position) {
    return false;
  }
}
