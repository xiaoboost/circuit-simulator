import { definePlugin } from '../../../../context';
import {
  IContextMenuItemHook,
  ContextMenuItemCategory as Category,
} from '../../../../types';
import { RotateRender as Render } from './render';
import { visible } from './visible';

definePlugin(({ registerHook }) => {
  registerHook(IContextMenuItemHook, {
    name: 'RotateButton',
    order: 0,
    category: Category.Visual,
    visible,
    Render,
  });
});
