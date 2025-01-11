import type { MarkMap } from '../map';
import { BaseLineMark } from './base-line';
import { DataWithPosition, MarkKind, MarkStructureWrapper } from './types';
import { setClass, getMarkConstructor } from './utils';

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

  // @ts-expect-error 这里只需要声明，不需要实例化
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

  hasLine(line: string) {
    return this.lines.includes(line);
  }

  addLine(line: string) {
    if (!this.lines.includes(line)) {
      this.lines.push(line);
    }
  }

  deleteLine(line: string) {
    const { lines, connection, map, position } = this;
    const index = lines.findIndex((item) => item === line);

    if (index === -1) {
      return this;
    }

    lines.splice(index, 1);

    for (const point of connection.getPoints()) {
      const node = map.get(point);

      // 节点被删除或者退化为器件引脚，需要删除引用
      if (!node || node.isPartPin()) {
        this.connection.delete(point);
        continue;
      }

      // 节点还存在，则需要判断引用关系
      if (node && 'hasLine' in node && lines.every((line) => !node.hasLine(line))) {
        this.deleteConnect(point);
        continue;
      }
    }

    if (lines.length > 1) {
      return this;
    }

    const LinePointMark = getMarkConstructor('LinePointMark');
    const newMark = new LinePointMark(map, {
      line: lines[0],
      position: position,
      connection: connection.toData(),
    });
    this.map.set(this.position, newMark);
    return newMark;
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
