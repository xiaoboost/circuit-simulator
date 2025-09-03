import { ILifeCycleHook } from '@circuit/shared';
import { definePlugin } from '../../../context';
import { IViewportService } from '../../../types';

definePlugin(({ registerHook, getService }) => {
  // 画布初始化时自动适应屏幕
  registerHook(ILifeCycleHook, {
    afterPainterMounted() {
      getService(IViewportService).fitPainter(40, -1);
    },
  });
});
