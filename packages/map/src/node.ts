import { Point, PointLike } from '@circuit/math';
import { Label, Connection } from './utils';

import {
  MarkNodeKind,
  NodeInputData,
  MarkNodeStructuredData,
} from './types';

import type { MarkMap } from './map';

/** 节点数据 */
export class MarkMapNode {
  position: Point;
  connections: Connection;
  labels: Label;

  /** 节点所在图纸 */
  readonly map: MarkMap;

  constructor(data: NodeInputData, map: MarkMap) {
    this.map = map;
    this.position = Point.from(data.position);
    this.connections = Connection.from(data.connections ?? []);
    this.labels = Label.from([data]);
  }

  /** 节点类型 */
  get kind() {
    return this.labels._kind;
  }

  /** 是否是导线节点 */
  get isLine() {
    return this.kind < 20;
  }

  /** 输出数据 */
  toData(): MarkNodeStructuredData {
    return {
      labels: this.labels.toData(),
      kind: MarkNodeKind[this.kind] as any,
      position: this.position.toData(),
      connections: this.connections.toData(),
    };
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
      if (current.connections.has(next.position)) {
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
      if (current.connections.has(next.position)) {
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
