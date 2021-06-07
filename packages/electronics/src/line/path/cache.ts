import { LinePath } from './line-path';

/** 搜索缓存 */
export class Cache<Key> {
  /** 缓存数据 */
  private _data: Record<string, LinePath | undefined> = {};
  /** 计算 key */
  private _mapping: (param: Key) => string;

  constructor(mapping: (param: Key) => string) {
    this._mapping = mapping;
  }

  has(param: Key) {
    return Boolean(this._data[this._mapping(param)]);
  }

  set(param: Key, way: LinePath) {
    this._data[this._mapping(param)] = way;
  }

  get(param: Key) {
    return this._data[this._mapping(param)];
  }

  delete(end: Key) {
    return Reflect.deleteProperty(this._data, this._mapping(end));
  }
}
