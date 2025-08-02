import { definePlugin } from '../../../../context';
import { DRAW_LAYER_HOOK } from '../../../../types';
import { PathSearchDebugger } from './render';

definePlugin(({ registerHook }) => {
  registerHook(DRAW_LAYER_HOOK, {
    name: 'path-search-debugger',
    order: 40,
    Render: PathSearchDebugger,
  });
});
