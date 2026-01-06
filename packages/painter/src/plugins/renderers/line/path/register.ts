import { definePlugin, ILineRendererHook } from '@circuit/contracts/painter';
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
