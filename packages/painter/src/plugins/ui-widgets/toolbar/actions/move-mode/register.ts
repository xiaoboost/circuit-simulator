import { definePlugin } from '../../../../../context';
import {
  PAINTER_TOOLBAR_ACTION_HOOK,
  CONFIGURATION_SERVICE,
  DRAG_SCENE_SERVICE,
  HOT_KEY_HOOK,
} from '../../../../../types';
import { Render } from './render';

definePlugin(({ registerHook, getService }) => {
  const { movePainterMode } = getService(CONFIGURATION_SERVICE);
  const scene = getService(DRAG_SCENE_SERVICE);

  registerHook(HOT_KEY_HOOK, {
    key: 'space',
    name: '切换为移动图纸模式',
    options: {
      keydown: true,
      keyup: false,
    },
    action() {
      if (scene.size === 0 && !movePainterMode.data) {
        movePainterMode.setData(true);
      }
    },
  });

  registerHook(HOT_KEY_HOOK, {
    key: 'space',
    name: '切换为指针模式',
    options: {
      keydown: false,
      keyup: true,
    },
    action() {
      if (scene.size === 0 && movePainterMode.data) {
        movePainterMode.setData(false);
      }
    },
  });

  // 注册移动画布按钮
  registerHook(PAINTER_TOOLBAR_ACTION_HOOK, {
    name: 'CursorModeButton',
    order: 1,
    Render,
  });
});
