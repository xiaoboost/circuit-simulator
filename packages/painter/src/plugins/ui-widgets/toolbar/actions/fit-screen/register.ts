import { definePlugin } from '../../../../../context';
import { PAINTER_TOOLBAR_ACTION_HOOK } from '../../../../../types';
import { FitScreenButton } from './render';

definePlugin(({ registerHook }) => {
  // 注册适应屏幕按钮
  registerHook(PAINTER_TOOLBAR_ACTION_HOOK, {
    name: 'FitScreenButton',
    order: 2,
    Render: FitScreenButton,
  });
});
