import {
  ILoggerService,
  IStateCoreService,
  IHotKeyHook,
} from '@circuit/shared';
import { remove } from '@xiao-ai/utils';
import { definePlugin } from '../../../context';
import { ISelectService } from '../../../types';

const LoggerName = '快捷键模块';

definePlugin(({ registerHook, getService }) => {
  // 注册删除快捷键
  registerHook(IHotKeyHook, {
    key: 'backspace,del',
    name: '删除',
    options: {
      keydown: true,
    },
    action() {
      const { value: { data: selected } } = getService(ISelectService);

      if (selected.size === 0) {
        return;
      }

      const painter = getService(IStateCoreService);
      const logger = getService(ILoggerService);
      const message = `删除以下元件：${Array.from(selected).join(', ')}`;

      logger.info(LoggerName, message);
      painter.commit({
        name: '删除元件',
        description: message,
        patch({ lines, parts }) {
          for (const id of selected) {
            remove(lines, (line) => line.id === id);
            remove(parts, (part) => part.id === id);
          }
        },
      });
    },
  });
});
