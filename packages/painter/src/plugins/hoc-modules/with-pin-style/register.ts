import { RENDERER_HOC } from '@circuit/inject';
import { definePlugin } from '../../../context';
import { PinStyleFactory } from './render';

definePlugin(({ registerHook }) => {
  // 引脚样式高阶组件
  registerHook(RENDERER_HOC, {
    name: 'HOC:PinStyle',
    order: 3,
    use: ({ name }) => name === 'PinRenderer',
    RenderHOC: PinStyleFactory,
  });
});
