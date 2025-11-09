import { IHotKeyHook, ILoggerService, IStateCoreService } from '@circuit/shared';
import { definePlugin } from '../../../../context';
import {
  IHoverService,
  ICollisionService,
  IConnectionService,
  IMapHashService,
  ISelectService,
  ICursorService,
  IContextMenuService,
  IContextMenuItemHook,
  ContextMenuItemCategory as Category } from '../../../../types';
import { planDeleteAndMergeWithService } from './action';
import { DeleteRender as Render } from './render';
import { visible } from './visible';

definePlugin(({ registerHook, getService }) => {
  registerHook(IContextMenuItemHook, {
    name: 'DeleteButton',
    order: 2,
    category: Category.Edit,
    visible,
    Render,
  });

  // 注册删除快捷键
  registerHook(IHotKeyHook, {
    key: 'backspace,del',
    name: '删除',
    action: () => {
      planDeleteAndMergeWithService({
        hoverService: getService(IHoverService),
        cursorService: getService(ICursorService),
        connectionService: getService(IConnectionService),
        collisionService: getService(ICollisionService),
        mapService: getService(IMapHashService),
        stateService: getService(IStateCoreService),
        loggerService: getService(ILoggerService),
        selectService: getService(ISelectService),
        contextMenuService: getService(IContextMenuService),
      });
    },
  });
});
