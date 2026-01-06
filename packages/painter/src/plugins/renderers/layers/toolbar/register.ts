import { definePlugin, IViewLayerHook } from '@circuit/contracts/painter';
import { Render } from './render';

definePlugin(({ registerHook }) => {
  // 注册组件渲染层
  registerHook(IViewLayerHook, {
    name: 'ToolBarLayer',
    order: 1,
    Render,
  });
});
