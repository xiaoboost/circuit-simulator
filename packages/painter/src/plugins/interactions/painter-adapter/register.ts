import { LIFE_CYCLE_HOOK, LAYOUT_SERVICE } from '@circuit/shared';
import { definePlugin } from '../../../context';
import { VIEWPORT_SERVICE, MAP_COORDINATE_SERVICE } from '../../../types';

definePlugin(({ registerHook, getService }) => {
  // 画布初始化时自动适应屏幕
  registerHook(LIFE_CYCLE_HOOK, {
    afterPainterMounted() {
      getService(VIEWPORT_SERVICE).fitPainter(40, -1);
    },
  });

  // 监听左侧边栏布局变化
  registerHook(LIFE_CYCLE_HOOK, {
    afterPluginInit() {
      const layoutService = getService(LAYOUT_SERVICE);
      const mapService = getService(MAP_COORDINATE_SERVICE);

      layoutService.leftSidebarCollapsed.observe((isCollapsed) => {
        const position = mapService.position.data;
        // 1 是边框宽度
        const width = layoutService.sidebarWidth + 1;

        // 左侧边栏折叠时，画布右移
        if (isCollapsed) {
          mapService.position.setData(position.add([width, 0]));
        }
        // 左侧边栏展开时，画布左移
        else {
          mapService.position.setData(position.add([-width, 0]));
        }
      });
    },
  });
});
