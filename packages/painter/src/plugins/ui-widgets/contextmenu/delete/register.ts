import { definePlugin } from '../../../../context';
import {
  IPainterContextMenuItemHook,
  IPainterContextMenuItemCategory as Category,
} from '../../../../types';
import { DeleteRender as Render } from './render';

definePlugin(({ registerHook }) => {
  registerHook(IPainterContextMenuItemHook, {
    name: 'DeleteButton',
    order: 2,
    category: Category.Edit,
    Render,
  });
});
