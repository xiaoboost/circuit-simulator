import { Painter } from '@circuit/painter';
import { definePlugin } from '../../../context';
import { MAIN_AREA_RENDER } from '../../../types';

definePlugin(({ registerHook }) => {
  registerHook(MAIN_AREA_RENDER, {
    name: 'painter',
    order: 1,
    Render: Painter,
  });
});
