import { DoubleLeft, DoubleRight } from '@circuit/icons';
import React from 'react';
import { Sidebar } from './sidebar';
import * as Styles from './styles.less';

export const RightSidebar = React.memo(function RightSidebar() {
  const title = '右侧边栏';

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
      内容
    </Sidebar>
  );
});
