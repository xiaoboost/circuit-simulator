import { definePlugin } from '@circuit/contracts/painter';
import { IRendererHOC } from '@circuit/inject';
import { PinStyleFactory } from './render';

definePlugin(({ registerHook }) => {
  // 引脚样式高阶组件
  registerHook(IRendererHOC, {
    name: 'HOC:PinStyle',
    order: 3,
    use: ({ name }) => name === 'PinRenderer',
    RenderHOC: PinStyleFactory,
  });
});
