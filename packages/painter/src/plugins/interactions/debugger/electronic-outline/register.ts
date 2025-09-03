import { definePlugin } from '../../../../context';
import { IDrawLayerHook } from '../../../../types';
import { ElectronicOutline } from './render';

definePlugin(({ registerHook }) => {
  registerHook(IDrawLayerHook, {
    name: 'electronic-outline',
    order: 20,
    Render: ElectronicOutline,
  });
});
