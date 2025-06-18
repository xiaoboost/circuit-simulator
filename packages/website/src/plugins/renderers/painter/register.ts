import { Painter } from '@circuit/painter';
import { definePlugin } from '../../../context';
import { MAIN_AREA_RENDER } from '../../../types/hook/main-area';

definePlugin(({ registerHook }) => {
  registerHook(MAIN_AREA_RENDER, {
    name: 'painter',
    order: 1,
    Render: Painter,
  });
});
