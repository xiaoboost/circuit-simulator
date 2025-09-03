import { definePlugin } from '../../../../context';
import { IPartRendererHook } from '../../../../types';
import { Render } from './render';

definePlugin(({ registerHook }) => {
  // 注册组件本体渲染器
  registerHook(IPartRendererHook, {
    name: 'PartBodyRenderer',
    order: 1,
    Render,
    getKey: ({ data }) => `${data.id}-body`,
  });
});
