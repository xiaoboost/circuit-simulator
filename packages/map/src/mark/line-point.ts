import type { MarkMap } from '../map';
import { BaseLineMark } from './base-line';
import { DataWithPosition, MarkKind, MarkStructureWrapper } from './types';
import { setClass, getMarkConstructor } from './utils';

export interface LinePointData {
  /** 导线编号 */
  line: string;
  /** 连接数据 */
  connection?: number[];
}

export type LinePointStructureData = MarkStructureWrapper<LinePointData, MarkKind.LinePoint>;

@setClass('LinePointMark')
export class LinePointMark extends BaseLineMark {
  /** 导线节点类别 */
  static MarkKind = MarkKind.LinePoint;

  // @ts-expect-error 这里只需要声明，不需要实例化
  declare readonly kind!: MarkKind.LinePoint;

  constructor(map: MarkMap, data: DataWithPosition<LinePointData>) {
    super(map, data);
  }

  /** 合并为交错节点 */
  toCrossMark(line: string) {
    const LineCrossMark = getMarkConstructor('LineCrossMark');
    const newMark = new LineCrossMark(this.map, {
      position: this.position,
      lines: [this.line, line],
      connection: this.connection.toData(),
    });
    this.map.set(this.position, newMark);
    return newMark;
  }

  toDate(): LinePointStructureData {
    return super.toData() as any;
  }
}
