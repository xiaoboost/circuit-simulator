import { IRendererHOC } from '@circuit/inject';
import { definePlugin } from '../../../context';
import { MovementFactory } from './render';

definePlugin(({ registerHook }) => {
  // 注册移动状态高阶组件
  registerHook(IRendererHOC, {
    name: 'HOC:Movement',
    order: 1,
    use: (hook) => !hook.name.includes('Pin'),
    RenderHOC: MovementFactory,
  });
});
