import { IHotKeyHook, ILoggerService, IStateCoreService } from '@circuit/shared';
import { definePlugin } from '../../../../context';
import {
  IHoverService,
  ICollisionService,
  IConnectionService,
  IMapHashService,
  ISelectService,
  IPainterContextMenuService,
  IPainterContextMenuItemHook,
  IPainterContextMenuItemCategory as Category } from '../../../../types';
import { planDeleteAndMerge } from './action';

import { DeleteRender as Render } from './render';

definePlugin(({ registerHook, getService }) => {
  registerHook(IPainterContextMenuItemHook, {
    name: 'DeleteButton',
    order: 2,
    category: Category.Edit,
    Render,
  });

  // 注册删除快捷键
  registerHook(IHotKeyHook, {
    key: 'backspace,del',
    name: '删除',
    action: () => {
      const hoverService = getService(IHoverService);
      const isHoverElectronic = Boolean(hoverService.status.data);

      if (!isHoverElectronic) {
        return;
      }

      const selectService = getService(ISelectService);
      const { value: { data: selected } } = selectService;
      const loggerService = getService(ILoggerService);
      const stateService = getService(IStateCoreService);
      const collisionService = getService(ICollisionService);
      const connectionService = getService(IConnectionService);
      const mapService = getService(IMapHashService);
      const contextMenuService = getService(IPainterContextMenuService);

      if (selected.size === 0) {
        loggerService.warn('删除模块', '没有选中元件');
        return;
      }

      const plan = planDeleteAndMerge(stateService.state.data, selected);

      const toRemove = new Set<string>([...plan.removedIds, ...plan.mergedRemovedLineIds]);
      for (const id of toRemove) {
        collisionService.removeEntity(id);
        connectionService.removeDevice(id);
        mapService.removeMark(stateService.getElectronic(id));
      }

      for (const line of plan.addedLines) {
        collisionService.setEntity(line);
        mapService.setMark(line);
      }

      for (const conn of plan.addLineConnections) {
        if (conn.pin0.length > 0) {
          connectionService.createConnections(conn.id, 0, conn.pin0);
        }
        if (conn.pin1.length > 0) {
          connectionService.createConnections(conn.id, 1, conn.pin1);
        }
      }

      stateService.commit({
        name: '删除元件',
        description: `删除以下元件：${Array.from(selected).join(', ')}`,
        patch: (data) => {
          data.parts = data.parts.filter((p) => !toRemove.has(p.id));
          data.lines = data.lines.filter((l) => !toRemove.has(l.id));
          data.lines.push(...plan.addedLines);
        },
      });

      selectService.clear();
      contextMenuService.close();
    },
  });
});
