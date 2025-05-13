import { definePlugin } from '../../../../../context';
import { PAINTER_TOOLBAR_ACTION_HOOK } from '../../../../../types';
import { Render } from './render';

definePlugin(({ registerHook }) => {
  // 注册调试按钮
  registerHook(PAINTER_TOOLBAR_ACTION_HOOK, {
    name: 'DebuggerModeButton',
    order: 0,
    Render,
  });
});
