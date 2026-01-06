import { definePlugin, ILineRendererHook } from '@circuit/contracts/painter';
import { Render } from './render';

definePlugin(({ registerHook }) => {
  // 注册导线引脚渲染器
  registerHook(ILineRendererHook, {
    name: 'LinePinLayerRenderer',
    order: 4,
    Render,
    getKey: ({ data }) => `${data.id}-pin`,
  });
});
