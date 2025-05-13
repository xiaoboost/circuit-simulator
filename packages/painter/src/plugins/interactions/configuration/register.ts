import { definePlugin, Watcher } from '../../../context';
import { IConfigurationService, CONFIGURATION_SERVICE, PartLabelVisibleKind } from '../../../types';

definePlugin(({ registerService }) => {
  const service: IConfigurationService = {
    PartLabelVisibleKind: PartLabelVisibleKind,
    partLabelVisible: new Watcher<PartLabelVisibleKind>(PartLabelVisibleKind.Visible),
    movePainterMode: new Watcher(false),
    debuggerMode: new Watcher(false),
  };

  // 注册配置服务
  registerService(CONFIGURATION_SERVICE, service);

  // 卸载器
  return () => {
    service.partLabelVisible.unObserve();
    service.movePainterMode.unObserve();
    service.debuggerMode.unObserve();
  };
});
