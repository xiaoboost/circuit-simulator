import { Point, PointLike } from '@circuit/math';
import { remove, PartPartial } from '@xiao-ai/utils';

import {
  MarkNodeData,
  MarkNodeKind,
  NodeInputData,
  MarkNodeLabel,
  MarkNodeStructuredData,
} from './types';

import type { MarkMap } from './map';

/** 节点数据 */
export class MarkMapNode implements MarkNodeData {
  position: Point;
  connections: Point[];
  labels: MarkNodeLabel[] = [];

  private _kind!: MarkNodeKind;

  /** 节点所在图纸 */
  readonly map: MarkMap;

  constructor(data: NodeInputData, map: MarkMap) {
    this.map = map;
    this.position = Point.from(data.position);
    this.connections = (data.connections ?? []).map(Point.from);
    this.addLabel(data.id, data.mark);
  }

  /** 节点类型 */
  get kind() {
    return this._kind;
  }

  /** 是否是导线节点 */
  get isLine() {
    return this.kind < 20;
  }

  private updateKind() {
    if (this.labels.length === 0) {
      throw new Error('没有标签');
    }

    const lineLabels = this.labels.filter((item) => /^line_\d+$/.test(item.id));
    const partLabels = this.labels.filter((item) => !/^line_\d+$/.test(item.id));

    // 多个器件标签必定是错误
    if (partLabels.length > 1) {
      throw new Error(`错误的标签：${JSON.stringify(this.labels, null, 2)}`);
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
      throw new Error(`错误的标签：${JSON.stringify(this.labels, null, 2)}`);
    }
  }

  /** 输出数据 */
  toData(): MarkNodeStructuredData {
    return {
      labels: this.labels,
      kind: MarkNodeKind[this.kind] as any,
      position: this.position.toData(),
      connections: this.connections.map((node) => node.toData()),
    };
  }

  /** 搜索标签 */
  findLabel(id: string, mark = -1) {
    return this.labels.find((label) => label.id === id && label.mark === mark);
  }

  /** 变更标签 */
  changeLabel(
    old: PartPartial<MarkNodeLabel, 'mark'>,
    data: PartPartial<MarkNodeLabel, 'mark'>,
  ) {
    const oldData = this.findLabel(old.id, old.mark);

    if (oldData) {
      oldData.id = data.id;
      oldData.mark = data.mark ?? -1;
      this.updateKind();
    }
  }

  /** 是否含有标签 */
  hasLabel(id: string, mark = -1) {
    return Boolean(this.findLabel(id, mark));
  }

  /** 新增标签 */
  addLabel(id: string, mark = -1) {
    if (!this.hasLabel(id, mark)) {
      this.labels.push({ id, mark });
      this.updateKind();
    }
  }

  /** 删除标签 */
  deleteLabel(id: string, mark = -1) {
    remove(this.labels, (label) => label.id === id && label.mark === mark);
    this.updateKind();
  }

  /** 清空标签 */
  clearLabel() {
    this.labels.length = 0;
    this._kind = MarkNodeKind.Space;
  }

  /** 是否含有此连接点 */
  hasConnect(point: PointLike) {
    return this.connections.some((node) => node.isEqual(point));
  }

  /** 新增连接点 */
  addConnect(point: PointLike) {
    const connectionsPoint = Point.from(point);

    if (!this.connections) {
      this.connections = [connectionsPoint];
    }
    else if (!this.hasConnect(point)) {
      this.connections.push(connectionsPoint);
    }
  }

  /** 移除连接点 */
  deleteConnect(point: PointLike) {
    remove(this.connections, (node) => node.isEqual(point), false);
  }

  /** 向着终点方向沿着导线前进 */
  towardEnd(end: PointLike): MarkMapNode {
    const { map } = this;
    const uVector = new Point(this.position, end).sign(20);

    if (!this.isLine || this.position.isEqual(end)) {
      return this;
    }

    let current: MarkMapNode = this;
    let next = map.get(this.position.add(uVector));

    // 当前点没有到达终点，还在导线所在直线内部，那就前进
    while (next?.isLine && !current.position.isEqual(end)) {
      if (current.hasConnect(next.position)) {
        current = next;
        next = map.get(current.position.add(uVector));
      }
      else {
        break;
      }
    }

    return current;
  }

  /** 沿导线方向的最远点 */
  alongLine(vector: PointLike): MarkMapNode {
    const { map } = this;
    const uVector = Point.from(vector).sign(20);

    if (!this.isLine) {
      return this;
    }

    let current: MarkMapNode = this;
    let next = map.get(this.position.add(uVector));

    // 当前点没有到达终点，还在导线所在直线内部，那就前进
    while (next?.isLine) {
      if (current.hasConnect(next.position)) {
        current = next;
        next = map.get(current.position.add(uVector));
      }
      else {
        break;
      }
    }

    return current;
  }
}
