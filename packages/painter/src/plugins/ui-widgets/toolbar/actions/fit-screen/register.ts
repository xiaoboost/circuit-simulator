import { definePlugin } from '../../../../../context';
import { IPainterToolBarActionHook } from '../../../../../types';
import { FitScreenButton } from './render';

definePlugin(({ registerHook }) => {
  // 注册适应屏幕按钮
  registerHook(IPainterToolBarActionHook, {
    name: 'FitScreenButton',
    order: 2,
    Render: FitScreenButton,
  });
});
