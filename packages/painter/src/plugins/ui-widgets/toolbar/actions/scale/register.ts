import { definePlugin } from '../../../../../context';
import { PAINTER_TOOLBAR_ACTION_HOOK } from '../../../../../types';
import { ScaleRender as Render } from './render';

definePlugin(({ registerHook }) => {
  registerHook(PAINTER_TOOLBAR_ACTION_HOOK, {
    name: 'ScaleAction',
    order: 99,
    Render,
  });
});
