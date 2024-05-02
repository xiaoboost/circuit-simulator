import { BaseMark } from './base';
import type { MarkMap } from '../map';
import { setClass } from './utils';
import { DataWithPosition, MarkKind, MarkStructureWrapper } from './types';

export interface PartData {
  /** 器件编号 */
  part: string;
}

export type PartStructureData = MarkStructureWrapper<PartData, MarkKind.Part>;

@setClass('PartMark')
export class PartMark extends BaseMark {
  /** 导线节点类别 */
  static MarkKind = MarkKind.Part;

  // @ts-ignore
  declare readonly kind!: MarkKind.Part;

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
