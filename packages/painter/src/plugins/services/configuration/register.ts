import { LIFE_CYCLE_HOOK } from '@circuit/inject';
import { STORAGE_SERVICE, ConfigurationWatcherItemCache } from '@circuit/shared';
import { definePlugin, Watcher } from '../../../context';
import {
  PartLabelVisibleKind,
  PAINTER_CONFIGURATION_SERVICE,
  IPainterConfigurationService,
} from '../../../types';

definePlugin(({ registerService, registerHook, getService }) => {
  const service: IPainterConfigurationService = {
    movePainterMode: new Watcher(false),
    PartLabelVisibleKind: PartLabelVisibleKind,
    partLabelVisible: new Watcher<PartLabelVisibleKind>(PartLabelVisibleKind.Visible),
    openMapMarkDebugger: new Watcher(false),
    visibleElectronicOutline: new Watcher(false),
  };

  const watcherCache: ConfigurationWatcherItemCache[] = [
    {
      key: 'Configuration.Painter.PartLabelVisible',
      watcher: service.partLabelVisible,
      default: PartLabelVisibleKind.Visible,
    },
    {
      key: 'Configuration.Painter.openMapMarkDebugger',
      watcher: service.openMapMarkDebugger,
      default: false,
    },
    {
      key: 'Configuration.Painter.visibleElectronicOutline',
      watcher: service.visibleElectronicOutline,
      default: false,
    },
    {
      key: 'Configuration.Painter.MovePainterMode',
      watcher: service.movePainterMode,
      default: false,
    },
  ];

  // 注册配置服务
  registerService(PAINTER_CONFIGURATION_SERVICE, service);

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
