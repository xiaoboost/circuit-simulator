import { definePlugin } from '../../../context';
import { RENDERER_HOC } from '../../../types';
import { PinRadiusFactory } from './render';

definePlugin(({ registerHook }) => {
  // 引脚半径高阶组件
  registerHook(RENDERER_HOC, {
    name: 'HOC:PinRadius',
    order: 3,
    use: ({ name }) => name === 'PinRenderer',
    RenderHOC: PinRadiusFactory,
  });
});
