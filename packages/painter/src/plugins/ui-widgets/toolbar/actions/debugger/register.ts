import { definePlugin } from '../../../../../context';
import { IPainterToolBarActionHook } from '../../../../../types';
import { DebuggerRender as Render } from './render';

definePlugin(({ registerHook }) => {
  // 注册调试按钮
  registerHook(IPainterToolBarActionHook, {
    name: 'DebuggerModeButton',
    order: 0,
    Render,
  });
});
