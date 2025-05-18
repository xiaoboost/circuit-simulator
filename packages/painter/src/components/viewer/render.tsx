import React from 'react';
import { usePainterHook } from '../../context';
import { VIEW_LAYER_HOOK } from '../../types';
import { viewerWrapper } from './styles.css';

export const Viewer = React.memo(function Viewer() {
  const viewers = usePainterHook(VIEW_LAYER_HOOK, 'asc');

  // 没有视图图层时不渲染
  if (viewers.length === 0) {
    return null;
  }

  return (
    <div className={viewerWrapper}>
      {viewers.map(({ Render, name }) => <Render key={name} />)}
    </div>
  );
});
