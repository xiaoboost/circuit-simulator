import { definePlugin } from '../../../context';
import { DRAW_LAYER_HOOK } from '../../../types';
import { ElectronicOutline } from './render';

definePlugin(({ registerHook }) => {
  registerHook(DRAW_LAYER_HOOK, {
    name: 'electronic-outline',
    order: 2,
    Render: ElectronicOutline,
  });
});
