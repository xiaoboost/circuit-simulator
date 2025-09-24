import { IOverlayRender } from '@circuit/shared';
import React from 'react';
import { useHook } from '../../context';
import * as Styles from './styles.less';

export const Overlay = React.memo(function Overlay() {
  const overlayRenders = useHook(IOverlayRender, 'asc');

  return (
    <div className={Styles.overlay}>
      {overlayRenders.map(({ Render, name }) => <Render key={name} />)}
    </div>
  );
});
