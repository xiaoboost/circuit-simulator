import type { PartPartial } from '@xiao-ai/utils';

import { MarkNodeLabel, MarkNodeKind } from './types';
import { Point, PointLike } from '@circuit/math';
import { ArrayLike } from '@circuit/shared';

export class Label extends ArrayLike<MarkNodeLabel, [string] | [string, number | undefined]> {
  protected _isEqual(a1: MarkNodeLabel, a2: MarkNodeLabel) {
    return a1.id === a2.id && a1.mark === a2.mark;
  }
  protected _packaged(id: string, mark?: number): MarkNodeLabel {
    return { id, mark: mark ?? -1 };
  }
  protected _toData(a: MarkNodeLabel): MarkNodeLabel {
    return a;
  }

  static from(data: PartPartial<MarkNodeLabel, 'mark'>[]): Label {
    const label = new Label();
    data.forEach((item) => label.add(item.id, item.mark));
    return label;
  }

  _kind!: MarkNodeKind;

  private updateKind() {
    if (this.length === 0) {
      this._kind = MarkNodeKind.Space;
      return;
    }

    const lineLabels = this.filter((item) => /^line_\d+$/.test(item.id));
    const partLabels = this.filter((item) => !/^line_\d+$/.test(item.id));

    // 多个器件标签必定是错误
    if (partLabels.length > 1) {
      throw new Error(`错误的标签：${JSON.stringify(this, null, 2)}`);
    }

    const partLabel = partLabels[0];

    // 器件节点优先
    if (partLabel) {
      this._kind = partLabel.mark >= 0 ? MarkNodeKind.PartPin : MarkNodeKind.Part;
    }
    else if (lineLabels.length === 1) {
      this._kind = lineLabels[0].mark >= 0 ? MarkNodeKind.LineSpacePoint : MarkNodeKind.Line;
    }
    else if (lineLabels.length > 1) {
      this._kind = lineLabels.every((item) => item.mark > 0)
        ? MarkNodeKind.LineCrossPoint
        : MarkNodeKind.LineCoverPoint;
    }
    else {
      throw new Error(`错误的标签：${JSON.stringify(this, null, 2)}`);
    }
  }

  add(id: string, mark?: number) {
    super.add(id, mark);
    this.updateKind();
  }

  delete(id: string, mark?: number) {
    const result = super.delete(id, mark);
    this.updateKind();
    return result;
  }

  clear() {
    super.clear();
    this.updateKind();
  }
}

export class Connection extends ArrayLike<Point, [PointLike], [number, number]> {
  protected _isEqual(a1: Point, a2: Point) {
    return a1.isEqual(a2);
  }
  protected _packaged(point: PointLike): Point {
    return Point.from(point);
  }
  protected _toData(point: Point): [number, number] {
    return point.toData();
  }

  static from(data: PointLike[]): Connection {
    const connection = new Connection();
    data.forEach((item) => connection.add(Point.from(item)));
    return connection;
  }
}
