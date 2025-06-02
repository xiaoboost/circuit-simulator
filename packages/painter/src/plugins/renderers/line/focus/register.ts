import { definePlugin } from '../../../../context';
import { LINE_RENDERER } from '../../../../types';
import { Render } from './render';

definePlugin(({ registerHook }) => {
  // 注册导线聚焦区域渲染器
  registerHook(LINE_RENDERER, {
    name: 'LineFocusRenderer',
    order: 2,
    Render,
    getKey: ({ data }) => `${data.id}-focus`,
  });
});
