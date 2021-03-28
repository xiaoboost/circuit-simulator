import { Electronic } from './base';
import { Matrix, Point } from 'src/math';
import { ElectronicPrototype, Electronics } from './parts';
import { ElectronicKind, PartData } from './types';

export class Part extends Electronic implements PartData {
  /** 旋转坐标 */
  rotate = new Matrix(2, 'E');
  /** 位置坐标 */
  position = new Point(500, 300);
  /** 参数描述 */
  params: string[] = [];
  /** 文本位置 */
  textPosition = new Point(0, 0);

  constructor(kind: ElectronicKind) {
    super(kind);
  }
}
