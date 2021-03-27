import { Electronic } from './base';
import { Matrix, Point } from 'src/math';
import { ElectronicPrototype } from './parts';
import { ElectronicKind, PartData, Connect } from './types';

export class Part extends Electronic implements PartData {
  /** 旋转坐标 */
  rotate = new Matrix(2, 'E');
  /** 位置坐标 */
  position = new Point(-1e+6, -1e+6);
  /** 连接描述 */
  connects: Connect[] = [];
  /** 参数描述 */
  params: string[] = [];
}
