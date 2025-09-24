import { Painter } from '@circuit/painter';
import { definePlugin } from '../../../context';
import { IMainAreaRender } from '../../../types';

definePlugin(({ registerHook }) => {
  registerHook(IMainAreaRender, {
    name: 'painter',
    order: 1,
    Render: Painter,
  });
});
