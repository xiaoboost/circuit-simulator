import { ILifeCycleHook, LifeCycleStage } from '@circuit/contracts/global';
import { definePlugin, IViewportService } from '@circuit/contracts/painter';

definePlugin(({ registerHook, getService }) => {
  // 画布初始化时自动适应屏幕
  registerHook(ILifeCycleHook, {
    order: LifeCycleStage.FINAL,
    onMounted() {
      getService(IViewportService).fitPainter(40, -1);
    },
  });
});
