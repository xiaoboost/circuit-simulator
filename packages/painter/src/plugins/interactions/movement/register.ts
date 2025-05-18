import { definePlugin } from '../../../context';
import { RENDERER_HOC } from '../../../types';
import { MovementRender } from './render';

definePlugin(({ registerHook }) => {
  // 注册移动状态高阶组件，所有渲染器都会使用它
  registerHook(RENDERER_HOC, {
    name: 'MovementHOC',
    order: 999,
    Render: MovementRender,
  });
});
