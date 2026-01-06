import { definePlugin, IDrawLayerHook } from '@circuit/contracts/painter';
import { ElectronicOutline } from './render';

definePlugin(({ registerHook }) => {
  registerHook(IDrawLayerHook, {
    name: 'electronic-outline',
    order: 20,
    Render: ElectronicOutline,
  });
});
