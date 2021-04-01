import { Electronic } from './base';
import { Matrix, Point } from 'src/math';
import { isNumber } from '@utils/assert';
import { DeepReadonly } from '@utils/types';
import { ElectronicPrototype, Electronics } from './parts';
import { ElectronicKind, PartData, map } from './constant';

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

  /** 器件原型数据 */
  get prototype(): DeepReadonly<ElectronicPrototype> {
    return Electronics[this.kind];
  }

  /** 设置标志位 */
  setSign() {
    // ..
  }

  /** 删除标记 */
  deleteSign() {
    // ..
  }

  /** 是否被占用 */
  isOccupied(location = this.position) {
    return false;
  }
}
