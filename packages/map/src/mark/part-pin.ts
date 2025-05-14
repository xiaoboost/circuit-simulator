import type { MarkMap } from '../map';
import { BaseMark } from './base';
import { DataWithPosition, MarkKind, MarkStructureWrapper } from './types';
import { setClass, getMarkConstructor } from './utils';

export interface PartPinData {
  /** 器件编号 */
  part: string;
  /** 引脚编号 */
  pin: number;
}

export type PartPinStructureData = MarkStructureWrapper<PartPinData, MarkKind.PartPin>;

@setClass('PartPinMark')
export class PartPinMark extends BaseMark {
  /** 导线节点类别 */
  static MarkKind = MarkKind.PartPin;

  // @ts-expect-error 这里只需要声明，不需要实例化
  declare readonly kind!: MarkKind.PartPin;

  /** 器件编号 */
  readonly part: string;
  /** 引脚编号 */
  readonly pin: number;

  constructor(map: MarkMap, data: DataWithPosition<PartPinData>) {
    super(map, data);
    this.part = data.part;
    this.pin = data.pin;
  }

  toData(): PartPinStructureData {
    return {
      ...super.toData(),
      part: this.part,
      pin: this.pin,
    };
  }

  /** 连接导线 */
  connectLine(line: string) {
    const PartPinLineMark = getMarkConstructor('PartPinLineMark');
    const newMark = new PartPinLineMark(this.map, { ...this, line });
    this.map.set(this.position, newMark);
    return newMark;
  }
}
