import { type DirectionLabel, type Direction, type MarginBox } from '@circuit/algorithm';
import { type ElectronicKind, type ElectronicCategory } from './kind';
import { type PropertyDescription } from './property';

/** 文本偏移量 */
export type TextBias = Partial<Record<DirectionLabel, number>>;

/** 器件每个引脚的描述 */
export interface PinDescription {
  /** 该节点距离器件中心点的相对位置 */
  readonly position: [number, number];
  /** 该节点对外延伸的方向 */
  readonly direction: Direction;
}

/** 外形元素描述 */
export interface ShapeDescription {
  /** DOM 元素名称 */
  readonly name: string;
  /** DOM 元素的所有属性 */
  readonly attribute: { [x: string]: string };
  /** 不可旋转元素 */
  readonly nonRotate?: true;
}

/** 器件原型数据类型 */
export interface ElectronicPrototype {
  /** 器件编号的默认前置标记 */
  readonly pre: string;
  /** 器件种类 */
  readonly kind: ElectronicKind;
  /** 器件类别 */
  readonly category: ElectronicCategory;
  /** 周围文字距离器件中心点的偏移量 */
  readonly textBias?: TextBias;
  /** 器件边框范围（上、右、下、左） */
  readonly margin: MarginBox;
  /** 每项参数的描述 */
  readonly properties: PropertyDescription[];
  /** 器件每个节点的描述 */
  readonly pins: PinDescription[];
  /** 器件外形元素的描述 */
  readonly shape: ShapeDescription[];
}
