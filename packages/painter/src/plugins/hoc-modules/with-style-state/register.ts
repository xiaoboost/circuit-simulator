import { definePlugin } from '../../../context';
import { RENDERER_HOC } from '../../../types';
import { StyleFactory } from './render';

definePlugin(({ registerHook }) => {
  // 注册临时样式高阶组件
  registerHook(RENDERER_HOC, {
    name: 'HOC:Style',
    order: 2,
    use: (hook) => !hook.name.includes('Pin'),
    RenderHOC: StyleFactory,
  });
});
