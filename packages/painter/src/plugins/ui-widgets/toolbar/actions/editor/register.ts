import { definePlugin } from '../../../../../context';
import { PAINTER_TOOLBAR_ACTION_HOOK } from '../../../../../types';
import { Render } from './render';

definePlugin(({ registerHook }) => {
  // 注册编辑按钮
  registerHook(PAINTER_TOOLBAR_ACTION_HOOK, {
    name: 'EditorButton',
    order: 2,
    Render,
  });
});
