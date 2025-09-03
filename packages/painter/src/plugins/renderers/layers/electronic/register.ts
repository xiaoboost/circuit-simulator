import { definePlugin } from '../../../../context';
import { IDrawLayerHook } from '../../../../types';
import { Render } from './render';

definePlugin(({ registerHook }) => {
  // 注册元件渲染层
  registerHook(IDrawLayerHook, {
    name: 'ElectronicLayer',
    order: 1,
    Render,
  });
});
