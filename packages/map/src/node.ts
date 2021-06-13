import { Point, PointLike } from '@circuit/math';
import { remove } from '@xiao-ai/utils';

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
  kind: MarkNodeKind;
  position: Point;
  connections: Point[];
  labels: MarkNodeLabel[] = [];

  /** 节点所在图纸 */
  readonly map: MarkMap;

  constructor(data: NodeInputData, map: MarkMap) {
    this.map = map;
    this.kind = data.kind;
    this.position = Point.from(data.position);
    this.connections = (data.connections ?? []).map(Point.from);
    this.labels = [{
      id: data.label,
      mark: -1,
    }];
  }

  /** 是否是导线节点 */
  get isLine() {
    return this.kind < 20;
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
  findLabel(id: string) {
    return this.labels.filter((label) => label.id === id);
  }

  /** 是否含有标签 */
  hasLabel(id: string, mark = -1) {
    return this.labels.some((label) => label.id === id && label.mark === mark);
  }

  /** 新增标签 */
  addLabel(id: string, mark = -1) {
    if (!this.hasLabel(id, mark)) {
      this.labels.push({ id, mark });
    }
  }

  /** 删除标签 */
  deleteLabel(id: string, mark = -1) {
    return remove(this.labels, (label) => label.id === id && label.mark === mark);
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
