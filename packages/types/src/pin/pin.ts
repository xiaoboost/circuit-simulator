/** 导线引脚 */
export interface ElectronicWithPin {
  /** 元件编号 */
  id: string;
  /** 元件引脚 */
  pin: number;
}

export interface LineWithIndex {
  /** 导线编号 */
  id: string;
  /** 导线线段索引 */
  index: number;
}

/** 器件与引脚 */
export interface PartWithPin extends ElectronicWithPin {
  /** 元件引用编号 */
  tag: string;
}
