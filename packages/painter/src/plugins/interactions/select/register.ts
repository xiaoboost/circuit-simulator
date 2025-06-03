import { definePlugin, Watcher } from '../../../context';
import { SELECT_SERVICE, LOGGER_SERVICE, EVENT_BUS_SERVICE, ISelectService } from '../../../types';

const LoggerName = '选择服务';

definePlugin(({ registerService, getService }) => {
  const selected = new Watcher(new Set<string>());
  const service: ISelectService = {
    value: selected,
    set(...ids) {
      if (ids.length > 0) {
        getService(LOGGER_SERVICE).info(LoggerName, '设置选中元件', ids.join(', '));
      }
      else {
        getService(LOGGER_SERVICE).info(LoggerName, '设置选中元件为空');
      }

      selected.setData(new Set(ids));
    },
    clear() {
      getService(LOGGER_SERVICE).info(LoggerName, '清空选中元件');
      selected.setData(new Set());
    },
  };

  // 订阅选中事件
  selected.observe((data) => {
    getService(EVENT_BUS_SERVICE).notify('SelectElectronics', data);
  });

  // 注册选择器服务
  registerService(SELECT_SERVICE, service);

  return () => {
    selected.unObserve();
  };
});
