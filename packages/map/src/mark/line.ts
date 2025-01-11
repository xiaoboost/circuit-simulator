import type { MarkMap } from '../map';
import { BaseLineMark } from './base-line';
import { DataWithPosition, MarkKind, MarkStructureWrapper } from './types';
import { setClass, getMarkConstructor } from './utils';

export interface LineData {
  /** 导线编号 */
  line: string;
  /** 连接数据 */
  connection?: number[];
}

export type LineStructureData = MarkStructureWrapper<LineData, MarkKind.Line>;

@setClass('LineMark')
export class LineMark extends BaseLineMark {
  /** 导线节点类别 */
  static MarkKind = MarkKind.Line;

  // @ts-expect-error 这里只需要声明，不需要实例化
  declare readonly kind!: MarkKind.Line;

  constructor(map: MarkMap, data: DataWithPosition<LineData>) {
    super(map, data);
  }

  addCoverLine(line: string) {
    const LineCoverMark = getMarkConstructor('LineCoverMark');
    const newMark = new LineCoverMark(this.map, {
      position: this.position,
      lines: [this.line, line],
      connections: [
        {
          id: this.line,
          data: this.connection.toData(),
        },
      ],
    });
    this.map.set(this.position, newMark);
    return newMark;
  }

  toDate(): LineStructureData {
    return super.toData() as any;
  }
}
