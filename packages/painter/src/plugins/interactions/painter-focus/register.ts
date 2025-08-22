import { LIFE_CYCLE_HOOK } from '@circuit/shared';
import { definePlugin } from '../../../context';
import {
  PAINTER_HTML_ELEMENT,
  EVENT_LISTENER_HOOK,
} from '../../../types';

definePlugin(({ registerHook, getService }) => {
  const getPainterFocus = () => {
    const painterEl = getService(PAINTER_HTML_ELEMENT)?.current;
    if (painterEl && document.activeElement !== painterEl) {
      painterEl.focus();
    }
  };

  // 点击画布自动获得焦点
  registerHook(EVENT_LISTENER_HOOK, {
    onMouseDown: getPainterFocus,
    onMouseUp: getPainterFocus,
  });

  // 画布初始化时获得焦点
  registerHook(LIFE_CYCLE_HOOK, {
    afterPainterMounted() {
      return new Promise<void>((resolve) => {
        if ('requestAnimationFrame' in window) {
          requestAnimationFrame(() => {
            getPainterFocus();
            resolve();
          });
        }
        else {
          getPainterFocus();
          resolve();
        }
      });
    },
  });
});
