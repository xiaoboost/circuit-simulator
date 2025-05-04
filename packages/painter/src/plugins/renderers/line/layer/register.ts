import { definePlugin } from '../../../../context';
import { DRAW_LAYER_HOOK } from '../../../../types';
import { Render } from './render';

definePlugin(({ registerHook }) => {
  // 注册导线渲染层
  registerHook(DRAW_LAYER_HOOK, {
    name: 'LineLayer',
    order: 2,
    Render,
  });
});
