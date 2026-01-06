import { IViewLayerHook } from '@circuit/contracts/painter';
import React from 'react';
import { useHook } from '../../context';
import * as Styles from './styles.less';

export const Viewer = React.memo(function Viewer() {
  const viewers = useHook(IViewLayerHook, 'asc');

  // 没有视图图层时不渲染
  if (viewers.length === 0) {
    return null;
  }

  return (
    <div className={Styles.viewerWrapper}>
      {viewers.map(({ Render, name }) => <Render key={name} />)}
    </div>
  );
});
