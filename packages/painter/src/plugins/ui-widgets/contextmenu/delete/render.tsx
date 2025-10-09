import { DeleteOutlined } from '@circuit/icons';
import { IStateCoreService, ILoggerService } from '@circuit/shared';
import React, { useCallback } from 'react';
import { useService } from '../../../../context';
import {
  IHoverService,
  ICollisionService,
  IConnectionService,
  IMapHashService,
  ISelectService,
  ICursorService,
  IContextMenuService,
} from '../../../../types';
import { Button } from '../components';
import { planDeleteAndMergeWithService } from './action';

export function DeleteRender() {
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
    >
      删除
    </Button>
  );
}
