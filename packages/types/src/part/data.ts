import {
  Point,
  Position,
  Direction,
  RotateMatrix,
} from '@circuit/algorithm';
import { ElectronicKind } from './kind';
import { PropertyValue } from './property';

/** 器件原始数据 */
export interface PartStoreData {
  /** 器件引用标签 */
  referenceTag: string;
  /** 器件类别 */
  kind: ElectronicKind;
  /** 器件中心坐标 */
  position: Position;
  /** 器件参数 */
  propertyValues?: PropertyValue[];
  /** 器件旋转矩阵 */
  rotate?: RotateMatrix;
  /**
   * 文本方向
   *
   * @description 用户视角方向
   */
  textDirection: Direction;
}

/** 器件结构化数据 */
export interface PartStructuredData extends Omit<Required<PartStoreData>, 'position'> {
  /** 器件编号 */
  id: string;
  /** 器件中心坐标 */
  position: Point;
}

/** 器件引脚状态 */
export interface PartPinData {
  /** 原本节点相对器件原点位置 */
  origin: Point;
  /** 节点向外的延申方向 */
  direction: Point;
  /** 引脚下标 */
  index: number;
  /** 引脚相对图纸原点位置 */
  position: Point;
}
