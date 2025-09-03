import { definePlugin } from '../../../../context';
import { IPinRendererHook } from '../../../../types';
import { Render } from './render';

definePlugin(({ registerHook }) => {
  // 注册引脚渲染器
  registerHook(IPinRendererHook, {
    name: 'PinRenderer',
    order: 1,
    getKey: ({ id }) => id,
    Render,
  });
});
