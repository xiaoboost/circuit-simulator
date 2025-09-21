import { definePlugin } from '../../../../context';
import { IPainterToolBarActionHook } from '../../../../types';
import { ScaleRender as Render } from './render';

definePlugin(({ registerHook }) => {
  registerHook(IPainterToolBarActionHook, {
    name: 'ScaleAction',
    order: 99,
    Render,
  });
});
