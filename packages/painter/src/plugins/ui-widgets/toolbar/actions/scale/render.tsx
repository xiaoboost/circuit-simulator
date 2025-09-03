import { PlusOutlined as Add, MinusOutlined as Minus } from '@circuit/icons';
import { ILoggerService } from '@circuit/shared';
import { Tooltip } from 'antd';
import React from 'react';
import { useService, useWatcher } from '../../../../../context';
import {
  IMapCoordinateService,
  IDragSceneService,
} from '../../../../../types';
import { Button, Divider } from '../../components';

const LoggerName = '快捷操作';

export function ScaleRender() {
  const dragScene = useService(IDragSceneService);
  const mapService = useService(IMapCoordinateService);
  const logger = useService(ILoggerService);
  const [scale] = useWatcher(mapService.scale);
  const [isDragging] = useWatcher(dragScene.isDragging);
  const isScaleMax = scale >= mapService.ScaleMax;
  const isScaleMin = scale <= mapService.ScaleMin;
  const draggingTooltip = '拖动中，无法缩放';
  const zoomInTooltip = isScaleMax
    ? '已是最大缩放'
    : isDragging
      ? draggingTooltip
      : '放大图纸';
  const zoomOutTooltip = isScaleMin
    ? '已是最小缩放'
    : isDragging
      ? draggingTooltip
      : '缩小图纸';

  const scaleZoomIn = () => {
    logger.info(LoggerName, '画布放大');
    mapService.zoomIn();
  };
  const scaleZoomOut = () => {
    logger.info(LoggerName, '画布缩小');
    mapService.zoomOut();
  };

  return (
    <>
      <Divider />
      <Tooltip title={zoomInTooltip} destroyOnHidden>
        <Button disabled={isDragging || isScaleMax} onClick={scaleZoomIn}>
          <Add />
        </Button>
      </Tooltip>
      <Tooltip title={zoomOutTooltip} destroyOnHidden>
        <Button disabled={isDragging || isScaleMin} onClick={scaleZoomOut}>
          <Minus />
        </Button>
      </Tooltip>
    </>
  );
}
