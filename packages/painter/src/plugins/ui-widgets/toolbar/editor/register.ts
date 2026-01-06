import { definePlugin, IPainterToolBarActionHook } from '@circuit/contracts/painter';
import { EditorRender as Render } from './render';

definePlugin(({ registerHook }) => {
  // 注册编辑按钮
  registerHook(IPainterToolBarActionHook, {
    name: 'EditorButton',
    order: 3,
    Render,
  });
});
