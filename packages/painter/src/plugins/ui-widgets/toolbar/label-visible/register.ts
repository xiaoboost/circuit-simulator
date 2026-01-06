import { definePlugin, IPainterToolBarActionHook } from '@circuit/contracts/painter';
import { LabelVisibleRender as Render } from './render';

definePlugin(({ registerHook }) => {
  registerHook(IPainterToolBarActionHook, {
    name: 'LabelVisibleButton',
    order: 2,
    Render,
  });
});
