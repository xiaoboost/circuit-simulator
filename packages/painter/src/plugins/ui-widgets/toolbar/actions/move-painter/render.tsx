import React, { useState } from 'react';
import { usePainterService, useWatcher, useHotkey } from '../../../../../context';
import { CONFIGURATION_SERVICE, DRAG_SCENE_SERVICE, CURSOR_SERVICE } from '../../../../../types';
import { Button } from '../../components';
import { Cursor, Hand } from './icons';

export function Render() {
  const configuration = usePainterService(CONFIGURATION_SERVICE);
  const dragScene = usePainterService(DRAG_SCENE_SERVICE);
  const cursorService = usePainterService(CURSOR_SERVICE);
  const [isMoveMode, setIsMoveMode] = useWatcher(configuration.movePainterMode);
  const [isSpaceKeyDown, setIsSpaceKeyDown] = useState(false);

  useHotkey('space', { keydown: true }, (ev) => {
    // 空格按下时，强制切换到移动模式
    if (dragScene.size === 0 && !ev.repeat) {
      setIsSpaceKeyDown(true);
      setIsMoveMode(true);
      cursorService.set(cursorService.kind.Drag);
    }
  });

  useHotkey('space', { keyup: true }, () => {
    // 空格抬起时，强制切换到鼠标模式
    // 如果此时在拖动，也进行强制转换
    if (isSpaceKeyDown) {
      setIsSpaceKeyDown(false);
      setIsMoveMode(false);

      // 没有场景进行中，则恢复图标
      // 有场景进行时，不需要变更图标，由场景结束时自行控制
      if (dragScene.size === 0) {
        cursorService.clear();
      }
    }
  });

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
      <Button
        onClick={onClickCursor}
        selected={!isMoveMode}
        disabled={isSpaceKeyDown}
      >
        <Cursor />
      </Button>
      <Button
        onClick={onClickHand}
        selected={isMoveMode}
        disabled={isSpaceKeyDown}
      >
        <Hand />
      </Button>
    </>
  );
}
