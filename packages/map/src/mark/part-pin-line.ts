import { BaseLineMark } from './base-line';
import type { MarkMap } from '../map';
import { setClass, getMarkConstructor } from './utils';
import { DataWithPosition, MarkKind, MarkStructureWrapper } from './types';

export interface PartPinLineData {
  /** 器件编号 */
  part: string;
  /** 引脚编号 */
  pin: number;
  /** 导线编号 */
  line: string;
  /** 连接数据 */
  connection?: number[];
}

export type PartPinLineStructureData = MarkStructureWrapper<PartPinLineData, MarkKind.PartPinLine>;

@setClass('PartPinLineMark')
export class PartPinLineMark extends BaseLineMark {
  /** 导线节点类别 */
  static MarkKind = MarkKind.PartPinLine;

  // @ts-ignore
  declare readonly kind!: MarkKind.PartPinLine;

  readonly part: string;
  readonly pin: number;
  readonly line: string;

  constructor(map: MarkMap, data: DataWithPosition<PartPinLineData>) {
    super(map, data);
    this.part = data.part;
    this.pin = data.pin;
    this.line = data.line;
  }

  // removeLine() {
  //   const PartPinMark = getMarkConstructor('PartPinMark');
  //   const newMark = new PartPinMark(this.map, { ...this, kind: MarkKind.PartPin });
  //   this.map.set(this.position, newMark);
  //   return newMark;
  // }

  // removePin() {
  //   const SingleLineMark = getMarkConstructor('SingleLineMark');
  //   const kind = MarkKind[MarkKind[this.kind].replace('PartPinLine', 'LinePoint') as keyof typeof MarkKind] as SingleLineMarkKind;
  //   const newMark = new SingleLineMark(this.map, { ...this, kind });
  //   this.map.set(this.position, newMark);
  //   return newMark;
  // }

  toData(): PartPinLineStructureData {
    return {
      kind: this.kind,
      part: this.part,
      pin: this.pin,
      line: this.line,
      position: this.position.toData(),
      connection: this.connection.toData(),
    };
  }
}
