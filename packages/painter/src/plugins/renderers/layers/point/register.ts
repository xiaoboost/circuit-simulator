import { definePlugin } from '../../../../context';
import { DRAW_LAYER_HOOK } from '../../../../types';
import { Render } from './render';

definePlugin(({ registerHook }) => {
  // 注册节点渲染层
  registerHook(DRAW_LAYER_HOOK, {
    name: 'PointLayer',
    order: 3,
    Render,
  });
});
