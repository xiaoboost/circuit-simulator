import { definePlugin } from '../../../../context';
import { PIN_RENDERER } from '../../../../types';
import { Render } from './render';

definePlugin(({ registerHook }) => {
  // 注册引脚渲染器
  registerHook(PIN_RENDERER, {
    name: 'PinRenderer',
    order: 1,
    getKey: ({ id }) => `${id}-pin`,
    Render,
  });
});
