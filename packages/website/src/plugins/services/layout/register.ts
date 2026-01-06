import {
  ILayoutService,
  IStorageService,
  IStorageItemConfig,
  ILeftSidebarRender,
  getStorage,
  definePlugin,
} from '@circuit/contracts/global';
import { ILifeCycleHook } from '@circuit/inject';
import { Watcher } from '@circuit/reactive';

definePlugin(({ registerService, registerHook, getService, getHook }) => {
  const service: ILayoutService = {
    leftSidebarActiveTab: new Watcher(''),
    rightSidebarCollapsed: new Watcher(false),
  };

  const watcherCache: IStorageItemConfig[] = [
    {
      key: 'Layout.LeftSidebar.Active',
      watcher: service.leftSidebarActiveTab,
      fromCache: (data: boolean | undefined) => {
        // 当且仅当数据为 false 时，才不展开
        if (data === false) {
          return '';
        }

        // 需要展开时，展开第一个标签页
        const leftSideBarHooks = getHook(ILeftSidebarRender);
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
  registerService(ILayoutService, service);

  // 注册初始化，读取缓存
  registerHook(ILifeCycleHook, {
    onMounted() {
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
