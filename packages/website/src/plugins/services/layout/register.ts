import { LIFE_CYCLE_HOOK } from '@circuit/inject';
import {
  ILayoutService,
  LAYOUT_SERVICE,
  STORAGE_SERVICE,
  ConfigurationWatcherItemCache,
} from '@circuit/shared';
import { definePlugin, Watcher } from '../../../context';

definePlugin(({ registerService, registerHook, getService }) => {
  const service: ILayoutService = {
    sidebarWidth: 300,
    leftSidebarCollapsed: new Watcher(false),
    rightSidebarCollapsed: new Watcher(false),
  };

  const watcherCache: ConfigurationWatcherItemCache[] = [
    {
      key: 'Layout.LeftSidebar.Collapsed',
      watcher: service.leftSidebarCollapsed,
      default: false,
    },
    {
      key: 'Layout.RightSidebar.Collapsed',
      watcher: service.rightSidebarCollapsed,
      default: false,
    },
  ];

  // 注册配置服务
  registerService(LAYOUT_SERVICE, service);

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
