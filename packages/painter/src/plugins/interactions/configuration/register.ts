import { definePlugin, Watcher } from '../../../context';
import {
  IConfigurationService,
  CONFIGURATION_SERVICE,
  PartLabelVisibleKind,
  LIFE_CYCLE_HOOK,
  CACHE_SERVICE,
} from '../../../types';

interface WatcherCacheData {
  key: string;
  watcher: Watcher<any>;
  default: any;
}

definePlugin(({ registerService, registerHook, getService }) => {
  const service: IConfigurationService = {
    PartLabelVisibleKind: PartLabelVisibleKind,
    partLabelVisible: new Watcher<PartLabelVisibleKind>(PartLabelVisibleKind.Visible),
    movePainterMode: new Watcher(false),
    openDebugLog: new Watcher(false),
    openPathSearcherDebugger: new Watcher(false),
  };

  const watcherCache: WatcherCacheData[] = [
    {
      key: 'Configuration.PartLabelVisible',
      watcher: service.partLabelVisible,
      default: PartLabelVisibleKind.Visible,
    },
    {
      key: 'Configuration.MovePainterMode',
      watcher: service.movePainterMode,
      default: false,
    },
    {
      key: 'Configuration.OpenDebugLog',
      watcher: service.openDebugLog,
      default: false,
    },
    {
      key: 'Configuration.OpenPathSearcherDebugger',
      watcher: service.openPathSearcherDebugger,
      default: false,
    },
  ];

  // 注册配置服务
  registerService(CONFIGURATION_SERVICE, service);

  // 注册初始化，读取缓存
  registerHook(LIFE_CYCLE_HOOK, {
    async beforeMounted() {
      const cacheService = getService(CACHE_SERVICE);

      for (const { key, watcher, default: defaultVal } of watcherCache) {
        const cacheVal = await cacheService.get(key);
        watcher.setData(cacheVal ?? defaultVal);
      }
    },
  });

  // 配置写入缓存
  watcherCache.forEach(({ key, watcher }) => {
    watcher.observe((data) => {
      getService(CACHE_SERVICE).set(key, data);
    });
  });

  // 卸载器
  return () => {
    watcherCache.forEach(({ watcher }) => {
      watcher.unObserve();
    });
  };
});
