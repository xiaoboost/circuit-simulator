import {
  DoubleLeftOutlined as DoubleLeft,
  DoubleRightOutlined as DoubleRight,
} from '@circuit/icons';
import { LAYOUT_SERVICE } from '@circuit/shared';
import React from 'react';
import { useHook, useService, useWatcher } from '../../context';
import { LEFT_SIDEBAR_RENDER } from '../../types';
import { Sidebar } from './sidebar';
import * as Styles from './styles.less';

export const LeftSidebar = React.memo(function LeftSidebar() {
  // TODO: 目前只有一个
  const render = useHook(LEFT_SIDEBAR_RENDER)[0];
  const layoutService = useService(LAYOUT_SERVICE);
  const [isCollapsed, setIsCollapsed] = useWatcher(layoutService.leftSidebarCollapsed);

  return (
    <Sidebar
      title={<render.title />}
      width={layoutService.sidebarWidth}
      isCollapsed={isCollapsed}
      onCollapse={(isCollapsed) => setIsCollapsed(isCollapsed)}
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
