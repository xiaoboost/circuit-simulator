import { BaseLineMark } from './base-line';
import type { MarkMap } from '../map';
import { setClass, getMarkConstructor } from './utils';
import { DataWithPosition, MarkKind, MarkStructureWrapper } from './types';

export interface LineCrossData {
  /** 导线编号 */
  lines: string[];
  /** 连接数据 */
  connection?: number[];
}

export type LineCrossStructureData = MarkStructureWrapper<LineCrossData, MarkKind.LineCross>;

@setClass('LineCrossMark')
export class LineCrossMark extends BaseLineMark {
  /** 导线节点类别 */
  static MarkKind = MarkKind.LineCross;

  // @ts-ignore
  declare readonly kind!: MarkKind.LineCross;

  readonly lines: string[];

  constructor(map: MarkMap, data: DataWithPosition<LineCrossData>) {
    super(map, {
      ...data,
      line: '',
    });

    this.lines = data.lines;
  }

  get isFullCross() {
    return this.connection.isFull;
  }

  addLine(line: string) {
    if (!this.lines.includes(line)) {
      this.lines.push(line);
    }
  }

  removeLine(line: string) {
    const index = this.lines.findIndex((item) => item === line);

    if (index > -1) {
      this.lines.splice(index, 1);
    }

    if (this.lines.length === 1) {
      const LinePointMark = getMarkConstructor('LinePointMark');
      const newMark = new LinePointMark(this.map, {
        line: this.lines[0],
        position: this.position,
        connection: this.connection.toData(),
      });
      this.map.set(this.position, newMark);
      return newMark;
    }
  }

  toData(): LineCrossStructureData {
    return {
      lines: this.lines,
      kind: this.kind,
      connection: this.connection.toData(),
      position: this.position.toData(),
    };
  }
}
