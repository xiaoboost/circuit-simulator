import { LIFE_CYCLE_HOOK } from '@circuit/inject';
import {
  IConfigurationService,
  CONFIGURATION_SERVICE,
  ConfigurationWatcherItemCache,
  STORAGE_SERVICE,
} from '@circuit/shared';
import { definePlugin, Watcher } from '../../../context';

definePlugin(({ registerService, registerHook, getService }) => {
  const service: IConfigurationService = {
    openDebugLog: new Watcher(false),
    previewMode: new Watcher(false),
  };

  const watcherCache: ConfigurationWatcherItemCache[] = [
    {
      key: 'Configuration.Global.OpenDebugLog',
      watcher: service.openDebugLog,
      default: false,
    },
  ];

  // 注册配置服务
  registerService(CONFIGURATION_SERVICE, service);

  // 注册初始化，读取缓存
  registerHook(LIFE_CYCLE_HOOK, {
    async afterPluginInit() {
      const storageService = getService(STORAGE_SERVICE);

      for (const { key, watcher, default: defaultVal } of watcherCache) {
        const cacheVal = await storageService.get(key);
        watcher.setData(cacheVal ?? defaultVal);
      }
    },
  });

  // 配置写入缓存
  watcherCache.forEach(({ key, watcher }) => {
    watcher.observe((data) => {
      getService(STORAGE_SERVICE).set(key, data);
    });
  });

  // 卸载器
  return () => {
    watcherCache.forEach(({ watcher }) => {
      watcher.destroy();
    });
  };
});
