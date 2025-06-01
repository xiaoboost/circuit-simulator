import { definePlugin } from '../../../../../context';
import { PAINTER_TOOLBAR_ACTION_HOOK } from '../../../../../types';
import { LabelVisibleRender as Render } from './render';

definePlugin(({ registerHook }) => {
  registerHook(PAINTER_TOOLBAR_ACTION_HOOK, {
    name: 'LabelVisibleButton',
    order: 2,
    Render,
  });
});
