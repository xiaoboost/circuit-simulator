import { IStorageService, definePlugin } from '@circuit/contracts/global';
import LocalForage from 'localforage';

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
  registerService(IStorageService, service);
});
