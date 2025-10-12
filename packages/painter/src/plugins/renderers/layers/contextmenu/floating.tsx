import React from 'react';
import { useService } from '../../../../context';
import { IContextMenuService } from '../../../../types';
import * as Styles from './styles.less';

export function FloatingContainer() {
  const contextMenuService = useService(IContextMenuService);

  return (
    <div
      className={Styles.floatingContainer}
      ref={contextMenuService.floatingElRef}
    />
  );
}
