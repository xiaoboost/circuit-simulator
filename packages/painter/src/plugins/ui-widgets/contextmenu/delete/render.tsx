import { IStateCoreService, ILoggerService } from '@circuit/contracts/global';
import {
  IHoverService,
  ICollisionService,
  IConnectionService,
  IMapHashService,
  ISelectService,
  ICursorService,
  IContextMenuService,
  IContextMenuItemProps,
} from '@circuit/contracts/painter';
import { DeleteOutlined } from '@circuit/icons';
import React, { useCallback } from 'react';
import { useService } from '../../../../context';
import { Button } from '../components';
import { planDeleteAndMergeWithService } from './action';

export function DeleteRender(props: IContextMenuItemProps) {
  const hoverService = useService(IHoverService);
  const selectService = useService(ISelectService);
  const loggerService = useService(ILoggerService);
  const stateService = useService(IStateCoreService);
  const collisionService = useService(ICollisionService);
  const connectionService = useService(IConnectionService);
  const mapService = useService(IMapHashService);
  const contextMenuService = useService(IContextMenuService);
  const cursorService = useService(ICursorService);
  const deleteCallback = useCallback(() => {
    planDeleteAndMergeWithService({
      hoverService,
      stateService,
      loggerService,
      selectService,
      connectionService,
      collisionService,
      mapService,
      cursorService,
      contextMenuService,
    });
  }, []);

  return (
    <Button
      icon={<DeleteOutlined />}
      addonAfter="Delete"
      onClick={deleteCallback}
      onMouseEnter={props.onMouseEnter}
      onMouseLeave={props.onMouseLeave}
    >
      删除
    </Button>
  );
}
