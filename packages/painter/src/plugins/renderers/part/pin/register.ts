import { definePlugin } from '../../../../context';
import { PART_RENDERER } from '../../../../types';
import { Render } from './render';

definePlugin(({ registerHook }) => {
  // 注册组件引脚渲染器
  registerHook(PART_RENDERER, {
    name: 'PartPinLayerRenderer',
    order: 4,
    Render,
    getKey: ({ data }) => `${data.id}-pin`,
  });
});
