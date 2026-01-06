import { definePlugin, IPartRendererHook } from '@circuit/contracts/painter';
import { Render } from './render';

definePlugin(({ registerHook }) => {
  // 注册组件引脚渲染器
  registerHook(IPartRendererHook, {
    name: 'PartPinLayerRenderer',
    order: 4,
    Render,
    getKey: ({ data }) => `${data.id}-pin`,
  });
});
