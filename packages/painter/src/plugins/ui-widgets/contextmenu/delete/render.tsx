import { DeleteOutlined } from '@circuit/icons';
import { IStateCoreService, ILoggerService } from '@circuit/shared';
import React, { useCallback } from 'react';
import { useService, useHotKey } from '../../../../context';
import {
  IPainterContextMenuItemProps,
  IHoverService,
  ICollisionService,
  IConnectionService,
  IMapHashService,
  ISelectService,
} from '../../../../types';
import { Button } from '../components';
import { planDeleteAndMerge } from './action';

const LoggerName = '删除模块';

export function DeleteRender(props: IPainterContextMenuItemProps) {
  const hoverService = useService(IHoverService);
  const selectService = useService(ISelectService);
  const loggerService = useService(ILoggerService);
  const stateService = useService(IStateCoreService);
  const collisionService = useService(ICollisionService);
  const connectionService = useService(IConnectionService);
  const mapService = useService(IMapHashService);
  const isHoverElectronic = Boolean(hoverService.status.data);
  const deleteCallback = useCallback(() => {
    const { value: { data: selected } } = selectService;

    if (selected.size === 0) {
      loggerService.warn(LoggerName, '没有选中元件');
      return;
    }

    const plan = planDeleteAndMerge(stateService.state.data, selected);

    // 先应用服务层的删除（选中与被合并移除的导线）
    const toRemove = new Set<string>([...plan.removedIds, ...plan.mergedRemovedLineIds]);
    for (const id of toRemove) {
      collisionService.removeEntity(id);
      connectionService.removeDevice(id);
      mapService.removeMark(stateService.getElectronic(id));
    }

    // 应用新增合并导线到服务
    for (const line of plan.addedLines) {
      collisionService.setEntity(line);
      mapService.setMark(line);
    }

    // 变更连接关系
    for (const conn of plan.addLineConnections) {
      if (conn.pin0.length > 0) {
        connectionService.createConnections(conn.id, 0, conn.pin0);
      }
      if (conn.pin1.length > 0) {
        connectionService.createConnections(conn.id, 1, conn.pin1);
      }
    }

    // 提交状态
    stateService.commit({
      name: '删除元件',
      description: `删除以下元件：${Array.from(selected).join(', ')}`,
      patch: (data) => {
        data.parts = data.parts.filter((p) => !toRemove.has(p.id));
        data.lines = data.lines.filter((l) => !toRemove.has(l.id));
        data.lines.push(...plan.addedLines);
      },
    });

    // 清空选择
    selectService.clear();
    // 关闭右键菜单
    props.onHide();
  }, []);

  useHotKey({
    key: 'backspace,del',
    name: '删除',
    action: () => {
      if (isHoverElectronic) {
        deleteCallback();
      }
    },
  });

  // 鼠标没有悬停在任何元件上时，不显示删除按钮
  if (!isHoverElectronic) {
    return null;
  }

  return (
    <Button
      icon={<DeleteOutlined />}
      subText="Delete"
      onClick={deleteCallback}
    >
      删除
    </Button>
  );
}
