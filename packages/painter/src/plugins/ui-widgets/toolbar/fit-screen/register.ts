import { definePlugin, IPainterToolBarActionHook } from '@circuit/contracts/painter';
import { FitScreenButton } from './render';

definePlugin(({ registerHook }) => {
  // 注册适应屏幕按钮
  registerHook(IPainterToolBarActionHook, {
    name: 'FitScreenButton',
    order: 2,
    Render: FitScreenButton,
  });
});
