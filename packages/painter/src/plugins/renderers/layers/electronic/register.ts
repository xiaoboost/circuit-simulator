import { definePlugin } from '../../../../context';
import { DRAW_LAYER_HOOK } from '../../../../types';
import { Render } from './render';

definePlugin(({ registerHook }) => {
  // 注册元件渲染层
  registerHook(DRAW_LAYER_HOOK, {
    name: 'ElectronicLayer',
    order: 1,
    Render,
  });
});
