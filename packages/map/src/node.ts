import { Point, PointLike } from '@circuit/math';
import { remove } from '@xiao-ai/utils';
import { MarkNodeData, MarkNodeKind, NodeInputData } from './types';

import type { MarkMap } from './map';

/** 节点数据 */
export class MarkMapNode implements MarkNodeData {
  label: string;
  kind: MarkNodeKind;
  point: Point;
  connect: Point[];

  /** 节点所在图纸 */
  readonly map: MarkMap;

  constructor(data: NodeInputData, map: MarkMap) {
    this.map = map;
    this.kind = data.kind;
    this.label = data.label;
    this.point = Point.from(data.point);
    this.connect = (data.connect ?? []).map(Point.from);
  }

  /** 是否是导线节点 */
  get isLine() {
    return this.kind < 20;
  }

  /** 是否含有此连接点 */
  hasConnect(point: PointLike) {
    return this.connect.some((node) => node.isEqual(point));
  }

  /** 新增连接点 */
  addConnect(point: PointLike) {
    const connectPoint = Point.from(point);

    if (!this.connect) {
      this.connect = [connectPoint];
    }
    else if (!this.hasConnect(point)) {
      this.connect.push(connectPoint);
    }
  }

  /** 移除连接点 */
  deleteConnect(point: PointLike) {
    remove(this.connect, (node) => node.isEqual(point), false);
  }

  /** 向着终点方向沿着导线前进 */
  towardEnd(end: PointLike): MarkMapNode {
    const { map } = this;
    const uVector = new Point(this.point, end).sign(20);

    if (!this.isLine || this.point.isEqual(end)) {
      return this;
    }

    let current: MarkMapNode = this;
    let next = map.get(this.point.add(uVector));

    // 当前点没有到达终点，还在导线所在直线内部，那就前进
    while (next?.isLine && !current.point.isEqual(end)) {
      if (current.hasConnect(next.point)) {
        current = next;
        next = map.get(current.point.add(uVector));
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
    let next = map.get(this.point.add(uVector));

    // 当前点没有到达终点，还在导线所在直线内部，那就前进
    while (next?.isLine) {
      if (current.hasConnect(next.point)) {
        current = next;
        next = map.get(current.point.add(uVector));
      }
      else {
        break;
      }
    }

    return current;
  }
}
