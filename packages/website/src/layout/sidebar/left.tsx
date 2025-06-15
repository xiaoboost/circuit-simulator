import { DoubleLeft, DoubleRight } from '@circuit/icons';
import React from 'react';
import { useHook } from '../../context';
import { LEFT_SIDEBAR_RENDER } from '../../types';
import { Sidebar } from './sidebar';
import * as Styles from './styles.less';

export const LeftSidebar = React.memo(function LeftSidebar() {
  // TODO: 目前只有一个
  const render = useHook(LEFT_SIDEBAR_RENDER)[0];

  return (
    <Sidebar
      title={<render.title />}
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
      <render.Render />
    </Sidebar>
  );
});
