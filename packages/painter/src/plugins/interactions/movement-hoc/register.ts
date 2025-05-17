import { definePlugin } from '../../../context';
import { RENDERER_HOC } from '../../../types';
import { MoveHOC } from './hoc';

definePlugin(({ registerHook }) => {
  // 注册移动服务 HOC
  registerHook(RENDERER_HOC, {
    name: 'MoveHOC',
    order: 1,
    RenderHOC: MoveHOC,
  });
});
