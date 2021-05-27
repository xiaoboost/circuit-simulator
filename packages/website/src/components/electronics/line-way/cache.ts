import { LineWay } from './line-way';
import { isDef } from '@utils/assert';

/** 搜索缓存 */
export class Cache<Key> {
  /** 缓存数据 */
  private _data: Record<string, LineWay | undefined> = {};
  /** 计算 key */
  private _toKey: (param: Key) => string;

  constructor(toKey: (param: Key) => string) {
    this._toKey = toKey;
  }

  has(param: Key) {
    return isDef(this._data[this._toKey(param)]);
  }

  set(param: Key, way: LineWay) {
    this._data[this._toKey(param)] = way;
  }

  get(param: Key) {
    return this._data[this._toKey(param)];
  }

  delete(end: Key) {
    return Reflect.deleteProperty(this._data, this._toKey(end));
  }
}
