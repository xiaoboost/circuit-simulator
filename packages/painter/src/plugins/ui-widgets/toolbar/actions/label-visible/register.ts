import { definePlugin } from '../../../../../context';
import { IPainterToolBarActionHook } from '../../../../../types';
import { LabelVisibleRender as Render } from './render';

definePlugin(({ registerHook }) => {
  registerHook(IPainterToolBarActionHook, {
    name: 'LabelVisibleButton',
    order: 2,
    Render,
  });
});
