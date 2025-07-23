/** 实体类型 */
export enum EntityKind {
  /** 元件 */
  Part,
  /** 元件引脚 */
  PartPin,
  /** 导线 */
  Line,
  /** 导线引脚 */
  LinePin,
}

/** 元件实体 */
export interface EntityPart {
  kind: EntityKind.Part;
  /** 元件编号 */
  id: string;
}

/** 元件引脚实体 */
export interface EntityPartPin {
  kind: EntityKind.PartPin;
  /** 元件编号 */
  id: string;
  /** 元件引脚 */
  pin: number;
}

/** 导线实体 */
export interface EntityLine {
  kind: EntityKind.Line;
  /** 导线编号 */
  id: string;
  /** 导线线段索引 */
  index: number;
}

/** 导线引脚实体 */
export interface EntityLinePin {
  kind: EntityKind.LinePin;
  /** 导线编号 */
  id: string;
  /**
   * 元件引脚
   *
   * @description `0`表示起点，`1`表示终点
   */
  pin: 0 | 1;
}

export type Entity = EntityPart | EntityPartPin | EntityLine | EntityLinePin;
