import { ILifeCycleHook } from '@circuit/inject';
import {
  IConfigurationService,
  IStorageService,
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
  registerService(IConfigurationService, service);

  // 注册初始化，读取缓存
  registerHook(ILifeCycleHook, {
    onCreated() {
      return getStorage(watcherCache, getService(IStorageService));
    },
  });

  // 卸载器
  return () => {
    watcherCache.forEach(({ watcher }) => {
      watcher.destroy();
    });
  };
});
