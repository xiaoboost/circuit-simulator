import { UndoOutlined as Undo, RedoOutlined as Redo } from '@circuit/icons';
import {
  ILoggerService,
  IStateCoreService,
} from '@circuit/shared';
import { Tooltip } from 'antd';
import React from 'react';
import { useService, useWatcher } from '../../../../context';
import { ISelectService } from '../../../../types';
import { Button } from '../components';

const LoggerName = '快捷操作';

export function EditorRender() {
  const logger = useService(ILoggerService);
  const painter = useService(IStateCoreService);
  const select = useService(ISelectService);
  const [canUndo] = useWatcher(painter.canUndo);
  const [canRedo] = useWatcher(painter.canRedo);
  const onUndo = () => {
    logger.info(LoggerName, '画布触发撤销');
    select.clear();
    painter.undo();
  };
  const onRedo = () => {
    logger.info(LoggerName, '画布触发重做');
    select.clear();
    painter.redo();
  };

  return (
    <>
      <Tooltip title={canUndo ? '撤销编辑' : '暂无操作可撤销'} destroyOnHidden>
        <Button disabled={!canUndo} onClick={onUndo}>
          <Undo />
        </Button>
      </Tooltip>
      <Tooltip title={canRedo ? '重做撤销' : '暂无操作可重做'} destroyOnHidden>
        <Button disabled={!canRedo} onClick={onRedo}>
          <Redo />
        </Button>
      </Tooltip>
    </>
  );
}
