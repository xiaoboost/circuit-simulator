import { STORAGE_SERVICE, IStorageService } from '@circuit/shared';
import LocalForage from 'localforage';
import { definePlugin } from '../../../context';

definePlugin(({ registerService }) => {
  const store = LocalForage.createInstance({
    name: 'circuit',
    storeName: 'storage',
  });
  const service: IStorageService = {
    get: (key) => store.getItem(key) as Promise<any>,
    set: (key, value) => store.setItem(key, value),
    remove: (key) => store.removeItem(key),
    clear: () => store.clear(),
  };

  // 注册持久化储存服务
  registerService(STORAGE_SERVICE, service);
});
