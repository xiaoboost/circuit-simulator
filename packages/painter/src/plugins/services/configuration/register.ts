import { ILifeCycleHook } from '@circuit/inject';
import { IStorageService, IStorageItemConfig, getStorage } from '@circuit/shared';
import { definePlugin, Watcher } from '../../../context';
import {
  PartLabelVisibleKind,
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
  registerService(IPainterConfigurationService, service);

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
