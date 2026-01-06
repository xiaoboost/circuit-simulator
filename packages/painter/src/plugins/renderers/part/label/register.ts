import { definePlugin, IPartRendererHook } from '@circuit/contracts/painter';
import { Render } from './render';

definePlugin(({ registerHook }) => {
  // 注册组件文本渲染器
  registerHook(IPartRendererHook, {
    name: 'PartLabelRenderer',
    order: 2,
    Render,
    getKey: ({ data }) => `${data.id}-label`,
  });
});
