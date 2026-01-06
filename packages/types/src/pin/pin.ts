import { type LineStructuredData } from '../line';
import { type PartStructuredData } from '../part';

type PickWithId<D extends { data: any }> = Omit<D, 'data'> & { id: string };

/** 器件引脚 */
export interface PartWithPin {
  /** 器件 */
  data: Readonly<PartStructuredData>;
  /** 器件引脚 */
  pin: number;
  /** 器件引用编号 */
  tag: string;
}

/** 导线引脚 */
export interface LineWithPin {
  /** 导线 */
  data: Readonly<LineStructuredData>;
  /** 导线引脚 */
  pin: number;
}

/** 导线线段 */
export interface LineWithIndex {
  /** 导线 */
  data: Readonly<LineStructuredData>;
  /** 导线线段索引 */
  index: number;
}

export type PartIdWithPin = PickWithId<PartWithPin>;
export type LineIdWithPin = PickWithId<LineWithPin>;
export type LineIdWithIndex = PickWithId<LineWithIndex>;

/** 元件引脚 */
export type ElectronicWithPin = PartWithPin | LineWithPin;
/** 元件编号引脚 */
export type ElectronicIdWithPin = PartIdWithPin | LineIdWithPin;
