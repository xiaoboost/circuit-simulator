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
   *  - 从上到下，从左往右
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

  entries(): IterableIterator<[Point, Mark]> {
    return this.getPoints()
      .map((point) => [point, this.get(point)!] as [Point, Mark])[Symbol.iterator]();
  }

  forEach(callbackfn: (value: Mark, key: Point, map: MarkMap) => void): void {
    for (const point of this.getPoints()) {
      callbackfn(this.get(point)!, point, this);
    }
  }

  keys(): IterableIterator<Point> {
    return this.getPoints()[Symbol.iterator]();
  }

  values(): IterableIterator<Mark> {
    return this.getPoints().map((point) => this.get(point)!)[Symbol.iterator]();
  }

  [Symbol.iterator](): IterableIterator<[Point, Mark]> {
    return this.entries();
  }

  /** 设置导线数据 */
  setLineMark(line: string, points: Point[]) {
    for (let i = 0; i < points.length; i++) {
      const point = points[i];
      const lastPoint = points[i - 1];
      const mark = this.get(point);

      // 运行时距离检查
      if (process.env.NODE_ENV === 'development' && lastPoint) {
        if (Math.abs(lastPoint.add(point, -1).product([1, 1])) !== 20) {
          throw new Error('导线节点距离必须是 20');
        }
      }

      // 端点
      if (i === 0 || i === points.length - 1) {
        if (mark) {
          if (mark.isLinePoint()) {
            mark.toCrossMark(line);
          }
          else if (mark.isLineCross() && !mark.isFullCross) {
            mark.addLine(line);
          }
          else if (mark.isPartPin()) {
            mark.connectLine(line);
          }
          else {
            throw new Error('导线端点只能出现在其他导线端点、交错节点、器件引脚处');
          }
        }
        else {
          this.set(point, {
            kind: MarkKind.LinePoint,
            line,
          });
        }
      }
      else {
        if (mark) {
          if (mark.isLine()) {
            mark.addCoverLine(line);
          }
          else {
            throw new Error('导线非端点只能途经其余导线的非端点');
          }
        }
        else {
          this.set(point, {
            kind: MarkKind.Line,
            line,
          });
        }
      }

      if (!lastPoint) {
        continue;
      }

      const lastMark = this.get<LineAndPointMark>(lastPoint)!;
      const currentMark = this.get<LineAndPointMark>(point)!;

      lastMark.addConnect(currentMark.position, line);
      currentMark.addConnect(lastMark.position, line);
    }
  }

  /** 移除导线数据 */
  deleteLineMark(line: string, points: Point[]) {
    for (let i = 0; i < points.length; i++) {
      const point = points[i];
      const lastPoint = points[i - 1];
      const mark = this.get(point);

      // 运行时距离检查
      if (process.env.NODE_ENV === 'development' && lastPoint) {
        if (Math.abs(lastPoint.add(point, -1).product([1, 1])) !== 20) {
          throw new Error('导线节点距离必须是 20');
        }

        if (
          mark &&
          (
            (('line' in mark) && mark.line !== line) ||
            (('lines' in mark) && !mark.lines.includes(line))
          )
        ) {
          throw new Error('删除节点并非指定导线编号');
        }
      }

      if (mark) {
        // 端点
        if (i === 0 || i === points.length - 1) {
          if (mark.isLinePoint()) {
            this.delete(mark.position);
          }
          else if (mark.isLineCross()) {
            mark.deleteLine(line);
          }
          else if (mark.isPartPinLine()) {
            mark.deleteLine();
          }
          else {
            throw new Error('导线端点只能出现在其他导线端点、交错节点、器件引脚处');
          }
        }
        else {
          if (mark.isLine()) {
            this.delete(mark.position);
          }
          else if (mark.isLineCover()) {
            mark.deleteLine(line);
          }
          else {
            throw new Error('删除导线时，非端点只可能有导线本身和交叠节点');
          }
        }
      }
    }
  }

  /** 设置器件引脚数据 */
  setPartPinMark(part: string, pin: number, position: Point) {
    const oldMark = this.get(position);

    if (oldMark) {
      throw new Error('器件引脚必须放置在`空位`上');
    }
    else {
      return this.set(position, {
        kind: MarkKind.PartPin,
        part,
        pin,
      });
    }
  }

  /** 删除器件引脚数据 */
  deletePartPinMark(point: Point) {
    const mark = this.get(point);

    if (!mark || (!mark.isPartPinLine() && !mark.isPartPin())) {
      throw new Error(`当前位置不是器件引脚：[${point[0]}, ${point[1]}]`);
    }

    if (mark.isPartPin()) {
      this.delete(point);
      return;
    }

    // 删除引脚
    mark.deletePin();
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
