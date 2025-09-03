import { definePlugin } from '../../../../context';
import { ILineRendererHook } from '../../../../types';
import { Render } from './render';

definePlugin(({ registerHook }) => {
  // 注册导线渲染器
  registerHook(ILineRendererHook, {
    name: 'LinePathRenderer',
    order: 1,
    Render,
    getKey: ({ data }) => `${data.id}-path`,
  });
});
