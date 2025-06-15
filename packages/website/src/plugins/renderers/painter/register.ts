import { definePlugin } from '../../../context';
import { MAIN_AREA_RENDER } from '../../../types/hook/main-area';
import { PainterRender } from './render';

definePlugin(({ registerHook }) => {
  registerHook(MAIN_AREA_RENDER, {
    name: 'painter',
    order: 1,
    Render: PainterRender,
  });
});
