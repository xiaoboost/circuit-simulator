import { FitScreen } from '@circuit/icons';
import { STATE_CORE_SERVICE } from '@circuit/shared';
import { Tooltip } from 'antd';
import React from 'react';
import { useService, useWatcher } from '../../../../../context';
import { VIEWPORT_SERVICE } from '../../../../../types';
import { Button } from '../../components';

export const FitScreenButton = () => {
  const viewport = useService(VIEWPORT_SERVICE);
  const stateCore = useService(STATE_CORE_SERVICE);
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
