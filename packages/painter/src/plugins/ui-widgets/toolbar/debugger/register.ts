import { definePlugin, IPainterToolBarActionHook } from '@circuit/contracts/painter';
import { DebuggerRender as Render } from './render';

definePlugin(({ registerHook }) => {
  // 注册调试按钮
  registerHook(IPainterToolBarActionHook, {
    name: 'DebuggerModeButton',
    order: 0,
    Render,
  });
});
