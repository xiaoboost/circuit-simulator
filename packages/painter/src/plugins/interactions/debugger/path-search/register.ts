import { definePlugin } from '../../../../context';
import { IDrawLayerHook } from '../../../../types';
import { PathSearchDebugger } from './render';

definePlugin(({ registerHook }) => {
  registerHook(IDrawLayerHook, {
    name: 'path-search-debugger',
    order: 40,
    Render: PathSearchDebugger,
  });
});
