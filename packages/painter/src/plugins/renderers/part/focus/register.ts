import { definePlugin } from '../../../../context';
import { PART_RENDERER } from '../../../../types';
import { Render } from './render';

definePlugin(({ registerHook }) => {
  // 注册组件聚焦区域渲染器
  registerHook(PART_RENDERER, {
    name: 'PartFocusRenderer',
    order: 3,
    Render,
    getKey: ({ data }) => `${data.id}-focus`,
  });
});
