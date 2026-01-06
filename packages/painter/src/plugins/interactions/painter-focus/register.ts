import { ILifeCycleHook, LifeCycleStage } from '@circuit/contracts/global';
import {
  definePlugin,
  IPainterHTMLElement,
  IEventListenerHook,
} from '@circuit/contracts/painter';

definePlugin(({ registerHook, getService }) => {
  const getPainterFocus = () => {
    const painterEl = getService(IPainterHTMLElement)?.current;
    if (painterEl && document.activeElement !== painterEl) {
      painterEl.focus();
    }
  };

  // 点击画布自动获得焦点
  registerHook(IEventListenerHook, {
    onMouseDown: getPainterFocus,
    onMouseUp: getPainterFocus,
  });

  // 画布初始化时获得焦点
  registerHook(ILifeCycleHook, {
    order: LifeCycleStage.FINAL,
    onMounted() {
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
