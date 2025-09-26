import { definePlugin } from '../../../context';
import {
  ISelectService,
  IEventListenerHook,
  IHoverService,
} from '../../../types';

definePlugin(({ registerHook, getService }) => {
  registerHook(IEventListenerHook, {
    onMouseDown(event) {
      const selectService = getService(ISelectService);
      const hoverService = getService(IHoverService);

      // 鼠标没有悬停在任何实体上
      if (!hoverService.status.data) {
        selectService.clear();
        return;
      }

      // 没有按住 Shift 键，选中当前实体
      if (!event.shiftKey) {
        selectService.set(hoverService.status.data.id);
        return;
      }

      // 按住 Shift 键，添加到选中内容中
      selectService.add(hoverService.status.data.id);
    },
  });
});
