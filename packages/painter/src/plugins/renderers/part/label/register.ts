import { definePlugin } from '../../../../context';
import { PART_RENDERER } from '../../../../types';
import { Render } from './render';

definePlugin(({ registerHook }) => {
  // 注册组件文本渲染器
  registerHook(PART_RENDERER, {
    name: 'PartLabelRenderer',
    order: 2,
    Render,
  });

  // TODO: 需要加个控制开关，控制是否显示
});
