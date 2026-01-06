import { definePlugin, IPainterToolBarActionHook } from '@circuit/contracts/painter';
import { ScaleRender as Render } from './render';

definePlugin(({ registerHook }) => {
  registerHook(IPainterToolBarActionHook, {
    name: 'ScaleAction',
    order: 99,
    Render,
  });
});
