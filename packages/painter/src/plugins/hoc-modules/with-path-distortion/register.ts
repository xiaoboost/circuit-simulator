import { definePlugin } from '../../../context';
import { RENDERER_HOC } from '../../../types';
import { PathDistortionFactory } from './render';

definePlugin(({ registerHook }) => {
  // 导线路径高阶组件
  registerHook(RENDERER_HOC, {
    name: 'HOC:PathDistortion',
    order: 4,
    use: ({ name }) => name === 'LinePathRenderer',
    RenderHOC: PathDistortionFactory,
  });
});
