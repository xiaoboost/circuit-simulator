import { IContextMenuService } from '@circuit/contracts/painter';
import React from 'react';
import { useService } from '../../../../context';
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
