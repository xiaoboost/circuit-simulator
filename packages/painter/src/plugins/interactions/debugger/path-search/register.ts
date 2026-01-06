import { definePlugin, IDrawLayerHook } from '@circuit/contracts/painter';
import { PathSearchDebugger } from './render';

definePlugin(({ registerHook }) => {
  registerHook(IDrawLayerHook, {
    name: 'path-search-debugger',
    order: 40,
    Render: PathSearchDebugger,
  });
});
