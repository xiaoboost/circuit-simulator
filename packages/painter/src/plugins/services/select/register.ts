import { createPartReferenceTag } from '@circuit/electronics';
import {
  ILoggerService,
  IStreamService,
  GlobalStreamConstant as Constant,
  isSameSet,
  IStateCoreService,
} from '@circuit/shared';
import { definePlugin, Watcher } from '../../../context';
import { ISelectService } from '../../../types';

const LoggerName = '选择服务';

definePlugin(({ registerService, getService }) => {
  const selected = new Watcher(new Set<string>());
  const service: ISelectService = {
    value: selected,
    set(...ids) {
      if (ids.length > 0) {
        getService(ILoggerService).info(LoggerName, '设置选中元件', getIdsString);
      }
      else {
        getService(ILoggerService).debug(LoggerName, '设置选中元件为空');
      }

      selected.setData(new Set(ids));
    },
    add(...ids) {
      service.set(...selected.data.values(), ...ids);
    },
    clear() {
      getService(ILoggerService).debug(LoggerName, '清空选中元件');
      selected.setData(new Set());
    },
  };

  function getIdsString(...ids: string[]) {
    const { state: { data: { parts, lines } } } = getService(IStateCoreService);
    const lineIds = lines
      .filter((line) => ids.includes(line.id))
      .map((line) => line.id);

    const partIds = parts
      .filter((part) => ids.includes(part.id))
      .map((part) => createPartReferenceTag(part));

    return [...lineIds, ...partIds].join(', ');
  }

  // 订阅选中事件
  selected.observe((nextSet, preSet) => {
    if (!preSet || !isSameSet(preSet, nextSet)) {
      getService(IStreamService)
        .get<Constant.SelectedChangePayload>(Constant.SelectedChange)
        .emit(nextSet);
    }
  });

  // 注册选择器服务
  registerService(ISelectService, service);

  return () => {
    selected.destroy();
  };
});
