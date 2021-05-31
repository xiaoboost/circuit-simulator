import { Point, PointLike } from '@circuit/math';
import { remove, PartPartial } from '@xiao-ai/utils';

/** 节点类型常量 */
export enum MarkNodeKind {
  /** 导线 */
  Line = 10,
  /** 导线空节点 */
  LinePoint,
  /** 导线交叠节点（实际并不相交） */
  LineCoverPoint,
  /** 导线交错节点 */
  LineCrossPoint,

  /** 器件节点 */
  Part = 20,
  /** 器件引脚节点 */
  PartPoint,
}

/** 节点数据 */
export interface MarkNodeData {
  /** 当前点属于哪个器件 */
  label: string;
  /** 节点类型 */
  kind: MarkNodeKind;
  /** 当前点的小坐标 */
  point: PointLike;
  /** 当前点在图纸中连接着另外哪些点 */
  connect: PointLike[];
}

export type NodeInputData = PartPartial<MarkNodeData, 'connect'>;
export type NodeUpdateData = Omit<PartPartial<MarkNodeData, 'connect'>, 'point'>;

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

/** 标记图纸 */
export class MarkMap {
  /** 节点转换为索引 key */
  static toKey(node: PointLike) {
    return node.join(',');
  }

  /** 数据储存 */
  private _data: Record<string, MarkMapNode> = {};

  /** 设置节点数据 */
  set(data: NodeInputData) {
    this._data[MarkMap.toKey(data.point)] = new MarkMapNode(data, this);
  }

  /** 获取节点数据 */
  get(point: PointLike): MarkMapNode | undefined {
    return this._data[MarkMap.toKey(point)];
  }

  /** 移除节点信息 */
  delete(point: PointLike) {
    delete this._data[MarkMap.toKey(point)];
  }
}
