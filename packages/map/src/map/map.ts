import { PointLike, Point } from '@circuit/math';
import { BaseMark } from '../mark/base';
import { MarkMapStructuredData } from './types';
import {
  Mark,
  MarkKind,
  getMarkFromData,
  LineAndPointMark,
  MarkStructureData,
  LineStructureData,
  LinePointStructureData,
  LineCoverStructureData,
  LineCrossStructureData,
  PartStructureData,
  PartPinStructureData,
  PartPinLineStructureData,
} from '../mark';

/** 标记图纸 */
export class MarkMap extends Map {
  static fromData(data: MarkMapStructuredData) {
    const map = new MarkMap();

    for (const item of data) {
      getMarkFromData(map, item as any);
    }

    return map;
  }

  static MarkKind = MarkKind;

  /** 节点转换为索引 key */
  private toKey(node: PointLike) {
    if (process.env.NODE_ENV === 'development') {
      if ((node[0] % 20 !== 0) || (node[1] % 20 !== 0)) {
        throw new Error(`节点数值必须是 20 的整数：[${node.join(', ')}]`);
      }
    }

    return `${node[0]},${node[1]}`;
  }

  /** 索引 key 转换为节点 */
  private toPoint(key: string) {
    return Point.from(key.split(',').map(Number));
  }

  /**
   * 获取所有节点
   *
   * @description 从上到下，从左往右
   */
  private getPoints() {
    return Array.from(super.keys())
      .map((key: string) => this.toPoint(key))
      .sort((pre, next) => {
        if (pre[1] < next[1]) {
          return -1;
        }
        else if (pre[1] === next[1]) {
          return pre[0] < next[0] ? -1 : 1;
        }
        else {
          return 1;
        }
      });
  }

  /** 是否含有此节点 */
  has(point: PointLike) {
    return super.has(this.toKey(point));
  }

  /** 设置节点数据 */
  set(position: PointLike, data: Mark): this;
  set(position: PointLike, data: Omit<LineStructureData, 'position'>): this;
  set(position: PointLike, data: Omit<LinePointStructureData, 'position'>): this;
  set(position: PointLike, data: Omit<LineCoverStructureData, 'position'>): this;
  set(position: PointLike, data: Omit<LineCrossStructureData, 'position'>): this;
  set(position: PointLike, data: Omit<PartStructureData, 'position'>): this;
  set(position: PointLike, data: Omit<PartPinStructureData, 'position'>): this;
  set(position: PointLike, data: Omit<PartPinLineStructureData, 'position'>): this;
  set(position: PointLike, data: Omit<MarkStructureData, 'position'> | Mark) {
    const node = data instanceof BaseMark ? data : getMarkFromData(this, { ...data, position } as any);
    super.set(this.toKey(position), node);
    return this;
  }

  /** 获取节点数据 */
  get<T extends Mark = Mark>(point: PointLike): T | undefined {
    return super.get(this.toKey(point));
  }

  /** 移除节点信息 */
  delete(point: PointLike) {
    return super.delete(this.toKey(point));
  }

  entries() {
    return this.getPoints().map((point) => [point, this.get(point)!] as [Point, Mark])[Symbol.iterator]();
  }

  forEach(callbackfn: (value: Mark, key: Point, map: MarkMap) => void): void {
    for (const point of this.getPoints()) {
      callbackfn(this.get(point)!, point, this);
    }
  }

  keys() {
    return this.getPoints()[Symbol.iterator]();
  }

  values() {
    return this.getPoints().map((point) => this.get(point)!)[Symbol.iterator]();
  }

  [Symbol.iterator]() {
    return this.entries();
  }

  /** 设置器件数据 */
  setPartMark(position: Point, part: string, pin?: number, ) {
    const oldMark = this.get(position);

    if (oldMark) {
      throw new Error('器件引脚必须放置在`空位`上');
    }
    else if (typeof pin === 'number') {
      return this.set(position, {
        kind: MarkKind.PartPin,
        part,
        pin,
      });
    }
    else {
      return this.set(position, {
        kind: MarkKind.Part,
        part,
      });
    }
  }

  /** 删除器件引脚数据 */
  deletePartMark(point: Point) {
    const mark = this.get(point);

    if (!mark) {
      return;
    }

    if (mark.isPartPin() || mark.isPart()) {
      this.delete(point);
      return;
    }
    else if (mark.isPartPinLine()) {
      mark.deletePin();
    }
    else {
      throw new Error(`当前位置不是器件：[${point[0]}, ${point[1]}]`);
    }
  }

  /** 数据格式化 */
  toData() {
    const data: MarkMapStructuredData = [];

    for (const val of this.values()) {
      data.push(val.toData());
    }

    return data;
  }
}
