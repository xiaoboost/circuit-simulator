import { RENDERER_HOC } from '@circuit/inject';
import { definePlugin } from '../../../context';
import { PathDistortionFactory } from './render';

definePlugin(({ registerHook }) => {
  // 导线路径高阶组件
  registerHook(RENDERER_HOC, {
    name: 'HOC:PathDistortion',
    order: 4,
    use: ({ name }) => name.startsWith('Line'),
    RenderHOC: PathDistortionFactory,
  });
});
