import type { MarkMap } from '../map';
import { BaseMark } from './base';
import { DataWithPosition, MarkKind, MarkStructureWrapper } from './types';
import { setClass } from './utils';

export interface PartData {
  /** 器件编号 */
  part: string;
}

export type PartStructureData = MarkStructureWrapper<PartData, MarkKind.Part>;

@setClass('PartMark')
export class PartMark extends BaseMark {
  /** 导线节点类别 */
  static MarkKind = MarkKind.Part;

  // @ts-expect-error 这里只需要声明，不需要实例化
  declare readonly kind!: MarkKind.Part;

  /** 器件编号 */
  readonly part: string;

  constructor(map: MarkMap, data: DataWithPosition<PartData>) {
    super(map, data);
    this.part = data.part;
  }

  toData(): PartStructureData {
    return {
      ...super.toData(),
      part: this.part,
    };
  }
}
