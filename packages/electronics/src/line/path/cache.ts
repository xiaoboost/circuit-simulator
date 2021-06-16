import { LinePath } from './line-path';

/** 搜索缓存 */
export class Cache<Key, Meta = any> {
  /** 缓存数据 */
  private _data: Record<string, LinePath | undefined> = {};
  /** 计算 key */
  private _mapping: (param: Key, meta?: Meta) => string;

  constructor(mapping: (param: Key, meta?: Meta) => string) {
    this._mapping = mapping;
  }

  has(param: Key, meta?: Meta) {
    return Boolean(this._data[this._mapping(param, meta)]);
  }

  set(param: Key, meta: Meta, way: LinePath) {
    this._data[this._mapping(param, meta)] = way;
  }

  get(param: Key, meta?: Meta) {
    return this._data[this._mapping(param, meta)];
  }

  delete(end: Key, meta?: Meta) {
    return Reflect.deleteProperty(this._data, this._mapping(end, meta));
  }
}
