import { definePlugin, Watcher } from '../../../context';
import { SELECT_SERVICE, ISelectService } from '../../../types';

definePlugin(({ registerService }) => {
  const selected = new Watcher(new Set<string>());
  const service: ISelectService = {
    value: selected,
    set(...ids) {
      selected.setData(new Set(ids));
    },
    clear() {
      selected.setData(new Set());
    },
  };

  // 注册选择器服务
  registerService(SELECT_SERVICE, service);

  return () => {
    selected.unObserve();
  };
});
