import { IStateCoreService } from '@circuit/contracts/global';
import { IViewportService } from '@circuit/contracts/painter';
import { FitScreen } from '@circuit/icons';
import { useWatcher } from '@circuit/reactive';
import { Tooltip } from 'antd';
import React from 'react';
import { useService } from '../../../../context';
import { Button } from '../components';

export const FitScreenButton = () => {
  const viewport = useService(IViewportService);
  const stateCore = useService(IStateCoreService);
  const [isEmptyPainter] = useWatcher(stateCore.isEmpty);
  const onFitScreen = () => {
    viewport.fitPainter(40);
  };

  return (
    <Tooltip title={isEmptyPainter ? '空图纸' : '适应屏幕'} destroyOnHidden>
      <Button disabled={isEmptyPainter} onClick={onFitScreen}>
        <FitScreen />
      </Button>
    </Tooltip>
  );
};
