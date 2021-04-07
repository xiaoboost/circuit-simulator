import { Point } from 'src/math';
import { LineWay } from './line-way';
import { isDef } from '@utils/assert';

/** 搜索缓存 */
export class Cache {
  /** 搜索数据 */
  private _data: AnyObject<LineWay | undefined> = {};
  /** 当前搜索的起点 */
  private _start: Point;
  /** 当前搜索的起始方向 */
  private _direction: Point;

  constructor(start: Point, direction: Point) {
    this._start = start;
    this._direction = direction;
  }

  /** 输入转换为特征值 */
  private toKey(end: Point, bias: Point) {
    const { _start: start, _direction: origin } = this;
    const direction = new Point(start, end);

    // 方向与初始方向相反
    if (!direction.isZero() && direction.isOppoDirection(origin)) {
      // 对终点的偏移量
      const endBias = new Point(end, bias);
      // 偏移量向原始方向的垂直向量投影
      const vertical = endBias.toProjection(origin.toVertical()).toUnit();
      // 终点-偏移量 合成标记
      return (`${end.join(',')}-${vertical.join(',')}`);
    }
    else {
      return end.join(',');
    }
  }

  has(end: Point, bias: Point) {
    return isDef(this._data[this.toKey(end, bias)]);
  }

  set(end: Point, bias: Point, way: LineWay) {
    this._data[this.toKey(end, bias)] = way;
  }

  get(end: Point, bias: Point) {
    return this._data[this.toKey(end, bias)];
  }

  delete(end: Point, bias: Point) {
    return Reflect.deleteProperty(this._data, this.toKey(end, bias));
  }
}