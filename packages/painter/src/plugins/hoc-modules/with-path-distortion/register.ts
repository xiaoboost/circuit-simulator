import { definePlugin } from '@circuit/contracts/painter';
import { IRendererHOC } from '@circuit/inject';
import { PathDistortionFactory } from './render';

definePlugin(({ registerHook }) => {
  // 导线路径高阶组件
  registerHook(IRendererHOC, {
    name: 'HOC:PathDistortion',
    order: 4,
    use: ({ name }) => name.startsWith('Line'),
    RenderHOC: PathDistortionFactory,
  });
});
