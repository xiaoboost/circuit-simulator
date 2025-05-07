import { definePlugin } from '../../../../context';
import { VIEW_LAYER_HOOK } from '../../../../types';
import { Render } from './render';

definePlugin(({ registerHook }) => {
  // 注册组件渲染层
  registerHook(VIEW_LAYER_HOOK, {
    name: 'ToolBarLayer',
    order: 1,
    Render,
  });
});
