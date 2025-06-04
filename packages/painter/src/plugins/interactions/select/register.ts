import { definePlugin, Watcher } from '../../../context';
import { SELECT_SERVICE, LOGGER_SERVICE, EVENT_BUS_SERVICE, ISelectService } from '../../../types';

const LoggerName = '选择服务';

function isSameSet(set1: Set<string>, set2: Set<string>) {
  if (set1.size !== set2.size) {
    return false;
  }

  for (const key1 of set1) {
    if (!set2.has(key1)) {
      return false;
    }
  }

  return true;
}

definePlugin(({ registerService, getService }) => {
  const selected = new Watcher(new Set<string>());
  const service: ISelectService = {
    value: selected,
    set(...ids) {
      if (ids.length > 0) {
        getService(LOGGER_SERVICE).info(LoggerName, '设置选中元件', ids.join(', '));
      }
      else {
        getService(LOGGER_SERVICE).debug(LoggerName, '设置选中元件为空');
      }

      selected.setData(new Set(ids));
    },
    clear() {
      getService(LOGGER_SERVICE).debug(LoggerName, '清空选中元件');
      selected.setData(new Set());
    },
  };

  // 订阅选中事件
  selected.observe((nextSet, preSet) => {
    if (!isSameSet(preSet, nextSet)) {
      getService(EVENT_BUS_SERVICE).notify('SelectElectronics', nextSet);
    }
  });

  // 注册选择器服务
  registerService(SELECT_SERVICE, service);

  return () => {
    selected.unObserve();
  };
});
