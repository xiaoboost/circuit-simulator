import { Tooltip } from 'antd';
import React from 'react';
import { usePainterService, useWatcher } from '../../../../../context';
import { LOGGER_SERVICE, PAINTER_SERVICE, SELECT_SERVICE } from '../../../../../types';
import { Button, Undo, Redo } from '../../components';

export function EditorRender() {
  const logger = usePainterService(LOGGER_SERVICE);
  const painter = usePainterService(PAINTER_SERVICE);
  const select = usePainterService(SELECT_SERVICE);
  const [canUndo] = useWatcher(painter.canUndo);
  const [canRedo] = useWatcher(painter.canRedo);
  const onUndo = () => {
    logger.info('快捷操作栏', '画布触发撤销');
    select.clear();
    painter.undo();
  };
  const onRedo = () => {
    logger.info('快捷操作栏', '画布触发重做');
    select.clear();
    painter.redo();
  };

  return (
    <>
      <Tooltip title='撤销编辑' destroyOnHidden>
        <Button disabled={!canUndo} onClick={onUndo}>
          <Undo />
        </Button>
      </Tooltip>
      <Tooltip title='重做撤销' destroyOnHidden>
        <Button disabled={!canRedo} onClick={onRedo}>
          <Redo />
        </Button>
      </Tooltip>
    </>
  );
}
