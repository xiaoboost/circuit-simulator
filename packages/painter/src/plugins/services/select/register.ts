import {
  ILoggerService,
  IStreamService,
  GlobalStream as Constant,
  isSameSet,
  IStateCoreService,
} from '@circuit/shared';
import { definePlugin, Watcher } from '../../../context';
import { ISelectService } from '../../../types';

const LoggerName = '选择服务';

definePlugin(({ registerService, getServices }) => {
  const selected = new Watcher(new Set<string>());
  const services = getServices({
    logger: ILoggerService,
    stream: IStreamService,
    state: IStateCoreService,
  });
  const service: ISelectService = {
    value: selected,
    isEmpty() {
      return selected.data.size === 0;
    },
    set(...ids) {
      const { logger, state } = services;

      if (ids.length > 0) {
        const idsString = state.getReferenceTag(ids);
        logger.info(LoggerName, '设置选中元件', idsString.join(', '));
      }
      else {
        logger.debug(LoggerName, '设置选中元件为空');
      }

      selected.setData(new Set(ids));
    },
    add(...ids) {
      service.set(...selected.data.values(), ...ids);
    },
    clear() {
      services.logger.debug(LoggerName, '清空选中元件');
      selected.setData(new Set());
    },
  };

  // 订阅选中事件
  selected.observe((nextSet, preSet) => {
    if (!preSet || !isSameSet(preSet, nextSet)) {
      services.stream
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
