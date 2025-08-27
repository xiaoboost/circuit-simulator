import { LIFE_CYCLE_HOOK } from '@circuit/inject';
import { STORAGE_SERVICE, IStorageItemConfig, getStorage } from '@circuit/shared';
import { definePlugin, Watcher } from '../../../context';
import {
  PartLabelVisibleKind,
  PAINTER_CONFIGURATION_SERVICE,
  IPainterConfigurationService,
} from '../../../types';

definePlugin(({ registerService, registerHook, getService }) => {
  const service: IPainterConfigurationService = {
    PartLabelVisibleKind: PartLabelVisibleKind,
    movePainterMode: new Watcher(false),
    partLabelVisible: new Watcher<PartLabelVisibleKind>(PartLabelVisibleKind.Visible),
    openMapMarkDebugger: new Watcher(false),
    openLineSearchDebugger: new Watcher(false),
    visibleElectronicOutline: new Watcher(false),
  };

  const watcherCache: IStorageItemConfig[] = [
    {
      key: 'Configuration.Painter.PartLabelVisible',
      watcher: service.partLabelVisible,
      default: PartLabelVisibleKind.Visible,
    },
  ];

  // 注册配置服务
  registerService(PAINTER_CONFIGURATION_SERVICE, service);

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
