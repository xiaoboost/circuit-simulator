import { PlusOutlined as Add, MinusOutlined as Minus } from '@circuit/icons';
import { LOGGER_SERVICE } from '@circuit/shared';
import React from 'react';
import { useService, useWatcher } from '../../../../../context';
import {
  MAP_COORDINATE_SERVICE,
  DRAG_SCENE_SERVICE,
} from '../../../../../types';
import { Button, Divider } from '../../components';
import * as Styles from './styles.less';

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
      <Button disabled={isDragging && scale <= mapService.ScaleMin} onClick={scaleZoomIn}>
        <Add />
      </Button>
      <div className={Styles.scaleNumber}>{Math.round(scale * 100)}%</div>
      <Button disabled={isDragging && scale >= mapService.ScaleMax} onClick={scaleZoomOut}>
        <Minus />
      </Button>
    </>
  );
}
