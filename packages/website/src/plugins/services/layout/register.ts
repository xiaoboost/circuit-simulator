import { LIFE_CYCLE_HOOK } from '@circuit/inject';
import {
  ILayoutService,
  LAYOUT_SERVICE,
  STORAGE_SERVICE,
  IStorageItemConfig,
  getStorage,
} from '@circuit/shared';
import { definePlugin, Watcher } from '../../../context';
import { LEFT_SIDEBAR_RENDER } from '../../../types';

definePlugin(({ registerService, registerHook, getService, getHook }) => {
  const service: ILayoutService = {
    leftSidebarActiveTab: new Watcher(''),
    rightSidebarCollapsed: new Watcher(false),
  };

  const watcherCache: IStorageItemConfig[] = [
    {
      key: 'Layout.LeftSidebar.Collapsed',
      watcher: service.leftSidebarActiveTab,
      fromCache: (data: boolean) => {
        if (!data) {
          return '';
        }

        // 需要展开时，展开第一个标签页
        const leftSideBarHooks = getHook(LEFT_SIDEBAR_RENDER);
        return leftSideBarHooks[0].name ?? '';
      },
      toCache: (data: string) => Boolean(data),
      default: '',
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
