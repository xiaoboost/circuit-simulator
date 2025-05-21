import { Tooltip } from 'antd';
import React from 'react';
import { usePainterService, useWatcher } from '../../../../../context';
import { LOGGER_SERVICE, PAINTER_SERVICE_KEY } from '../../../../../types';
import { Button } from '../../components';
import { Undo, Redo } from './icons';

export function Render() {
  const logger = usePainterService(LOGGER_SERVICE);
  const painter = usePainterService(PAINTER_SERVICE_KEY);
  const [canUndo] = useWatcher(painter.canUndo);
  const [canRedo] = useWatcher(painter.canRedo);
  const onUndo = () => {
    logger.info('快捷操作栏', '画布触发撤销');
    painter.undo();
  };
  const onRedo = () => {
    logger.info('快捷操作栏', '画布触发重做');
    painter.redo();
  };

  return (
    <>
      <Tooltip title='撤销编辑'>
        <Button disabled={!canUndo} onClick={onUndo}>
          <Undo />
        </Button>
      </Tooltip>
      <Tooltip title='重做撤销'>
        <Button disabled={!canRedo} onClick={onRedo}>
          <Redo />
        </Button>
      </Tooltip>
    </>
  );
}
