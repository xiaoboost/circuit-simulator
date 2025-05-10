import React, { useState } from 'react';
import { usePainterService, useWatcher, useHotkey } from '../../../../../context';
import { CONFIGURATION_SERVICE, DRAG_SCENE_SERVICE } from '../../../../../types';
import { Button } from '../../components';
import { Cursor, Hand } from './icons';

export function Render() {
  const configuration = usePainterService(CONFIGURATION_SERVICE);
  const dragScene = usePainterService(DRAG_SCENE_SERVICE);
  const [isMoveMode, setIsMoveMode] = useWatcher(configuration.movePainterMode);
  const [isSpaceKeyDown, setIsSpaceKeyDown] = useState(false);

  useHotkey('space', { keydown: true }, (ev) => {
    // 空格按下时，强制切换到移动模式
    if (dragScene.size === 0 && !ev.repeat) {
      console.log('space keydown');
      setIsSpaceKeyDown(true);
      setIsMoveMode(true);
    }
  });

  useHotkey('space', { keyup: true }, () => {
    // 空格按下时，强制切换到鼠标模式
    if (dragScene.size === 0 && isSpaceKeyDown) {
      console.log('space keyup');
      setIsSpaceKeyDown(false);
      setIsMoveMode(false);
    }
  });

  const onClickCursor = () => {
    console.log('onClickCursor');
    // 无任何场景，且空格键没有按下，则关闭移动模式
    if (dragScene.size === 0 && !isSpaceKeyDown) {
      setIsMoveMode(false);
    }
  };
  const onClickHand = () => {
    console.log('onClickHand');
    // 无任何场景，且空格键没有按下，则打开移动模式
    if (dragScene.size === 0 && !isSpaceKeyDown) {
      setIsMoveMode(true);
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
