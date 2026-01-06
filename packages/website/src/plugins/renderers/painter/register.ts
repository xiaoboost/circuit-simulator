import { IMainAreaRender, definePlugin } from '@circuit/contracts/global';
import { Painter } from '@circuit/painter';

definePlugin(({ registerHook }) => {
  registerHook(IMainAreaRender, {
    name: 'painter',
    order: 1,
    Render: Painter,
  });
});
