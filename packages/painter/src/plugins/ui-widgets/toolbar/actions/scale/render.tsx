import { PlusOutlined as Add, MinusOutlined as Minus } from '@circuit/icons';
import { LOGGER_SERVICE } from '@circuit/shared';
import { Tooltip } from 'antd';
import React from 'react';
import { useService, useWatcher } from '../../../../../context';
import {
  MAP_COORDINATE_SERVICE,
  DRAG_SCENE_SERVICE,
} from '../../../../../types';
import { Button, Divider } from '../../components';

const LoggerName = '快捷操作';

export function ScaleRender() {
  const dragScene = useService(DRAG_SCENE_SERVICE);
  const mapService = useService(MAP_COORDINATE_SERVICE);
  const logger = useService(LOGGER_SERVICE);
  const [scale] = useWatcher(mapService.scale);
  const [isDragging] = useWatcher(dragScene.isDragging);

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
      <Tooltip title='放大图纸' destroyOnHidden>
        <Button disabled={isDragging || scale >= mapService.ScaleMax} onClick={scaleZoomIn}>
          <Add />
        </Button>
      </Tooltip>
      <Tooltip title='缩小图纸' destroyOnHidden>
        <Button disabled={isDragging || scale <= mapService.ScaleMin} onClick={scaleZoomOut}>
          <Minus />
        </Button>
      </Tooltip>
    </>
  );
}
