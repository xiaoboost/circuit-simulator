import { DoubleLeft, DoubleRight, SearchOutlined } from '@circuit/icons';
import { Input, Tooltip } from 'antd';
import React, { useMemo, useState } from 'react';
import { Sidebar } from './sidebar';
import * as Styles from './styles.less';

export const LeftSidebar = React.memo(function LeftSidebar() {
  const title = '左侧边栏';

  return (
    <Sidebar
      title={title}
      icons={{
        collapse: <DoubleLeft />,
        expand: <DoubleRight />,
      }}
      classNames={{
        wrapper: Styles.leftSidebarWrapper,
        sidebar: Styles.leftSidebar,
        collapsed: Styles.leftSidebarCollapsed,
      }}
    >
      内容
    </Sidebar>
  );
});
