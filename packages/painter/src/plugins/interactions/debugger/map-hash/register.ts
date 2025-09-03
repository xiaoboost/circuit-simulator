import { definePlugin } from '../../../../context';
import { IDrawLayerHook } from '../../../../types';
import { MapHashDebugger } from './render';

definePlugin(({ registerHook }) => {
  registerHook(IDrawLayerHook, {
    name: 'map-hash-debugger',
    order: 30,
    Render: MapHashDebugger,
  });
});
