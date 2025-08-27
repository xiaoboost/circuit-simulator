import { LIFE_CYCLE_HOOK } from '@circuit/shared';
import { definePlugin } from '../../../context';
import { VIEWPORT_SERVICE } from '../../../types';

definePlugin(({ registerHook, getService }) => {
  // 画布初始化时自动适应屏幕
  registerHook(LIFE_CYCLE_HOOK, {
    afterPainterMounted() {
      getService(VIEWPORT_SERVICE).fitPainter(40, -1);
    },
  });
});
