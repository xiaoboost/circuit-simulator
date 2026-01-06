import type { Watcher } from '@circuit/reactive';
import type { IStorageService } from '../services/storage';

/** 配置服务缓存数据 */
export interface IStorageItemConfig {
  key: string;
  watcher: Watcher<any>;
  default: any;
  toCache?: (data: any) => any;
  fromCache?: (data: any) => any;
}

export async function getStorage(configs: IStorageItemConfig[], storage: IStorageService) {
  for (const { key, watcher, default: defaultVal, fromCache, toCache } of configs) {
    const cacheVal = await storage.get(key);
    const data = fromCache ? fromCache(cacheVal) : cacheVal;
    watcher.setData(data ?? defaultVal);
    watcher.observe((data) => {
      storage.set(key, toCache ? toCache(data) : data);
    });
  }
}
