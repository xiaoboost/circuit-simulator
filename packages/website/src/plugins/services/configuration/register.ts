import { LIFE_CYCLE_HOOK } from '@circuit/inject';
import {
  IConfigurationService,
  CONFIGURATION_SERVICE,
  STORAGE_SERVICE,
  IStorageItemConfig,
  getStorage,
} from '@circuit/shared';
import { definePlugin, Watcher } from '../../../context';

definePlugin(({ registerService, registerHook, getService }) => {
  const service: IConfigurationService = {
    openDebugLog: new Watcher(false),
    previewMode: new Watcher(false),
  };

  const watcherCache: IStorageItemConfig[] = [
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
    afterPluginInit() {
      return getStorage(watcherCache, getService(STORAGE_SERVICE));
    },
  });

  // 卸载器
  return () => {
    watcherCache.forEach(({ watcher }) => {
      watcher.destroy();
    });
  };
});
