import { remove } from '@xiao-ai/utils';
import { definePlugin } from '../../../context';
import {
  HOT_KEY_HOOK,
  PAINTER_SERVICE,
  EVENT_LISTENER_HOOK,
  PAINTER_HTML_ELEMENT,
  SELECT_SERVICE,
  LOGGER_SERVICE,
} from '../../../types';

const LoggerName = '快捷键模块';

definePlugin(({ registerHook, getService }) => {
  // 画布自动获得焦点
  registerHook(EVENT_LISTENER_HOOK, {
    onMouseDown() {
      const painterEl = getService(PAINTER_HTML_ELEMENT)?.current;
      if (painterEl && document.activeElement !== painterEl) {
        painterEl.focus();
      }
    },
  });

  // 注册删除快捷键
  registerHook(HOT_KEY_HOOK, {
    key: 'backspace,del',
    name: '删除',
    options: {
      keydown: true,
    },
    action() {
      const { value: { data: selected } } = getService(SELECT_SERVICE);

      if (selected.size === 0) {
        return;
      }

      const painter = getService(PAINTER_SERVICE);
      const logger = getService(LOGGER_SERVICE);
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
