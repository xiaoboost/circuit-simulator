import { definePlugin } from '../../../../context';
import { POINT_RENDERER } from '../../../../types';
import { Render } from './render';

definePlugin(({ registerHook }) => {
  // 注册节点渲染器
  registerHook(POINT_RENDERER, {
    name: 'PointRenderer',
    order: 1,
    // getKey: ({ data }) => `${data.position.join(',')}-point`,
    Render,
  });
});
