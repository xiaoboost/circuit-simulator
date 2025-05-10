import { definePlugin } from '../../../../../context';
import { PAINTER_TOOLBAR_ACTION_HOOK } from '../../../../../types';
import { Render } from './render';

definePlugin(({ registerHook }) => {
  // 注册移动画布按钮
  registerHook(PAINTER_TOOLBAR_ACTION_HOOK, {
    name: 'MoveModeButton',
    order: 1,
    Render,
  });
});
