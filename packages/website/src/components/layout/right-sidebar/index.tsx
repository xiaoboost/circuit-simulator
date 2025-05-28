import React from 'react';
import { DoubleLeft, DoubleRight, Sidebar } from '../../base';
import * as Styles from './styles.less';

export function RightSidebar() {
  const title = '器件属性';
  return (
    <Sidebar
      title={title}
      icons={{
        collapse: <DoubleRight />,
        expand: <DoubleLeft />,
      }}
      classNames={{
        wrapper: Styles.rightSidebarWrapper,
        sidebar: Styles.rightSidebar,
        collapsed: Styles.rightSidebarCollapsed,
      }}
    >
      属性
    </Sidebar>
  );
}
