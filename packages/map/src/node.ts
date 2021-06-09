import { Point, PointLike } from '@circuit/math';
import { remove, isDef } from '@xiao-ai/utils';
import { MarkNodeData, MarkNodeKind, NodeInputData } from './types';

import type { MarkMap } from './map';

/** 节点数据 */
export class MarkMapNode implements MarkNodeData {
  label: string;
  kind: MarkNodeKind;
  position: Point;
  connect: Point[];
  mark = -1;

  /** 节点所在图纸 */
  readonly map: MarkMap;

  constructor(data: NodeInputData, map: MarkMap) {
    this.map = map;
    this.kind = data.kind;
    this.label = data.label;
    this.position = Point.from(data.position);
    this.connect = (data.connect ?? []).map(Point.from);

    if (isDef(data.mark)) {
      this.mark = data.mark;
    }
  }

  /** 是否是导线节点 */
  get isLine() {
    return this.kind < 20;
  }

  /** 输出数据 */
  toData() {
    return {
      label: this.label,
      kind: this.kind,
      position: this.position.toData(),
      connect: this.connect.map((node) => node.toData()),
      mark: this.mark,
    };
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
