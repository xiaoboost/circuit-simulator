import type { MarkMap } from '../map';
import { BaseLineMark } from './base-line';
import { DataWithPosition, MarkKind, MarkStructureWrapper } from './types';
import { setClass, getMarkConstructor } from './utils';

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

  // @ts-expect-error 这里只需要声明，不需要实例化
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

  deleteLine() {
    const { map, position } = this;
    const PartPinMark = getMarkConstructor('PartPinMark');
    const newMark = new PartPinMark(map, this);
    this.map.set(position, newMark);
    return newMark;
  }

  deletePin() {
    const LinePointMark = getMarkConstructor('LinePointMark');
    const newMark = new LinePointMark(this.map, {
      line: this.line,
      position: this.position.toData(),
      connection: this.connection.toData(),
    });
    this.map.set(this.position, newMark);
    return newMark;
  }

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
