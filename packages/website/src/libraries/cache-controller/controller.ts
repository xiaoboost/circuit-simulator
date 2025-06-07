import localforage from 'localforage';
import { StorageName } from './constant';

export class CacheController {
  private store: LocalForage;

  constructor(name: string) {
    this.store = localforage.createInstance({
      name: StorageName,
      storeName: name,
    });
  }

  /**
   * 设置缓存数据
   * @param key 缓存键
   * @param value 缓存值
   */
  set(key: string, value: any): Promise<void> {
    return this.store.setItem(key, value);
  }

  /**
   * 获取缓存数据
   * @param key 缓存键
   * @returns 缓存值
   */
  get<T>(key: string): Promise<T | null> {
    return this.store.getItem<T>(key);
  }

  /**
   * 删除指定的缓存数据
   * @param key 缓存键
   */
  delete(key: string): Promise<void> {
    return this.store.removeItem(key);
  }

  /**
   * 清除所有缓存数据
   */
  clear(): Promise<void> {
    return this.store.clear();
  }

  /**
   * 获取所有缓存数据
   * @returns 所有缓存数据的键值对
   */
  getAll(): Promise<Record<string, any>> {
    const result: Record<string, any> = {};
    return this.store.iterate((value, key) => {
      result[key] = value;
    }).then(() => result);
  }

  /**
   * 检查键是否存在
   * @param key 缓存键
   * @returns 是否存在
   */
  has(key: string): Promise<boolean> {
    return this.store.getItem(key).then(value => value !== null);
  }

  /**
   * 获取缓存数据的大小
   * @returns 缓存数据数量
   */
  size(): Promise<number> {
    return this.store.length();
  }
}
