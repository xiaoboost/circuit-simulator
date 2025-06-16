import { Cursor, Hand } from '@circuit/icons';
import { CONFIGURATION_SERVICE } from '@circuit/shared';
import { Tooltip } from 'antd';
import React from 'react';
import { useService, useWatcher, Watcher } from '../../../../../context';
import { DRAG_SCENE_SERVICE, CURSOR_SERVICE } from '../../../../../types';
import { Button } from '../../components';

export const MoveModeRenderWithSpace = (spaceKeyDown: Watcher<boolean>) => {
  return function MoveModeRender() {
    const configuration = useService(CONFIGURATION_SERVICE);
    const dragScene = useService(DRAG_SCENE_SERVICE);
    const cursorService = useService(CURSOR_SERVICE);
    const [isMoveMode, setIsMoveMode] = useWatcher(configuration.movePainterMode);
    const [isSpaceKeyDown] = useWatcher(spaceKeyDown);
    const onClickCursor = () => {
      // 无任何场景，且空格键没有按下，则关闭移动模式
      if (!isSpaceKeyDown) {
        setIsMoveMode(false);
        // 有场景进行时也强制恢复图标
        cursorService.clear();
      }
    };
    const onClickHand = () => {
      // 无任何场景，且空格键没有按下，则打开移动模式
      if (dragScene.size === 0 && !isSpaceKeyDown) {
        setIsMoveMode(true);
        cursorService.set(cursorService.kind.Drag);
      }
    };

    return (
      <>
        <Tooltip title='编辑模式' destroyOnHidden>
          <Button
            onClick={onClickCursor}
            selected={!isMoveMode}
            disabled={isSpaceKeyDown}
          >
            <Cursor />
        </Button>
        </Tooltip>
        <Tooltip title='移动模式' destroyOnHidden>
          <Button
            onClick={onClickHand}
            selected={isMoveMode}
            disabled={isSpaceKeyDown}
          >
            <Hand />
          </Button>
        </Tooltip>
      </>
    );
  };
};
