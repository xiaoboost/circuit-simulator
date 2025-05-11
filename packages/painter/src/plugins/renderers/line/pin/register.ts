import { definePlugin } from '../../../../context';
import { LINE_RENDERER } from '../../../../types';
import { Render } from './render';

definePlugin(({ registerHook }) => {
  // 注册导线引脚渲染器
  registerHook(LINE_RENDERER, {
    name: 'LinePinRenderer',
    order: 4,
    Render,
  });
});
