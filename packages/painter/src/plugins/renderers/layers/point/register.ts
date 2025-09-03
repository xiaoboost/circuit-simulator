import { definePlugin } from '../../../../context';
import { IDrawLayerHook } from '../../../../types';
import { PointLayerRender as Render } from './render';

definePlugin(({ registerHook }) => {
  // 注册节点渲染层
  registerHook(IDrawLayerHook, {
    name: 'PointLayer',
    order: 3,
    Render,
  });
});
