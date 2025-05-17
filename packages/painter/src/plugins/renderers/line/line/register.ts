import { definePlugin } from '../../../../context';
import { LINE_RENDERER } from '../../../../types';
import { Render } from './render';

definePlugin(({ registerHook }) => {
  // 注册导线渲染器
  registerHook(LINE_RENDERER, {
    name: 'LineRenderer',
    order: 1,
    Render,
    getKey: ({ data }) => `${data.id}-path`,
  });
});
