import { CONFIGURATION_SERVICE, HOT_KEY_HOOK } from '@circuit/shared';
import { definePlugin, Watcher } from '../../../../../context';
import {
  PAINTER_TOOLBAR_ACTION_HOOK,
  DRAG_SCENE_SERVICE,
  CURSOR_SERVICE,
} from '../../../../../types';
import { MoveModeRenderWithSpace } from './render';

definePlugin(({ registerHook, getService }) => {
  /** 空格键按下状态 */
  const spaceKeyDown = new Watcher(false);
  /** 移动画布模块按钮 */
  const MoveModeButton = MoveModeRenderWithSpace(spaceKeyDown);

  // 注册空格键按下状态
  registerHook(HOT_KEY_HOOK, [
    {
      name: '切换为移动模式',
      key: 'space',
      options: {
        keydown: true,
        keyup: false,
      },
      action: (ev) => {
        const dragScene = getService(DRAG_SCENE_SERVICE);
        const cursorService = getService(CURSOR_SERVICE);
        const configuration = getService(CONFIGURATION_SERVICE);

        // 空格按下时，强制切换到移动模式
        if (dragScene.size === 0 && !ev.repeat) {
          spaceKeyDown.setData(true);
          configuration.movePainterMode.setData(true);
          cursorService.set(cursorService.kind.Drag);
        }
      },
    },
    {
      name: '切换为鼠标模式',
      key: 'space',
      options: {
        keydown: false,
        keyup: true,
      },
      action: () => {
        const dragScene = getService(DRAG_SCENE_SERVICE);
        const cursorService = getService(CURSOR_SERVICE);
        const configuration = getService(CONFIGURATION_SERVICE);

        // 空格抬起时，强制切换到鼠标模式
        // 如果此时在拖动，也进行强制转换
        if (spaceKeyDown.data) {
          spaceKeyDown.setData(false);
          configuration.movePainterMode.setData(false);

          // 没有场景进行中，则恢复图标
          // 有场景进行时，不需要变更图标，由场景结束时自行控制
          if (dragScene.size === 0) {
            cursorService.clear();
          }
        }
      },
    },
  ]);

  // 注册移动画布按钮
  registerHook(PAINTER_TOOLBAR_ACTION_HOOK, {
    name: 'MoveModeButton',
    order: 1,
    Render: MoveModeButton,
  });
});
