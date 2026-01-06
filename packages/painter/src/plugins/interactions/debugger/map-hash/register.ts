import { definePlugin, IDrawLayerHook } from '@circuit/contracts/painter';
import { MapHashDebugger } from './render';

definePlugin(({ registerHook }) => {
  registerHook(IDrawLayerHook, {
    name: 'map-hash-debugger',
    order: 30,
    Render: MapHashDebugger,
  });
});
