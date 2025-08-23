import {
  DoubleLeftOutlined as DoubleLeft,
  DoubleRightOutlined as DoubleRight,
} from '@circuit/icons';
import { LAYOUT_SERVICE } from '@circuit/shared';
import React from 'react';
import { useHook, useService, useWatcher } from '../../context';
import { RIGHT_SIDEBAR_RENDER } from '../../types';
import { Sidebar } from './sidebar';
import * as Styles from './styles.less';

export const RightSidebar = React.memo(function RightSidebar() {
  // TODO: 目前只有一个
  const render = useHook(RIGHT_SIDEBAR_RENDER)[0];
  const layoutService = useService(LAYOUT_SERVICE);
  const [isCollapsed, setIsCollapsed] = useWatcher(layoutService.rightSidebarCollapsed);

  return (
    <Sidebar
      title={<render.title />}
      width={layoutService.sidebarWidth}
      isCollapsed={isCollapsed}
      onCollapse={(isCollapsed) => setIsCollapsed(isCollapsed)}
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
      <render.Render />
    </Sidebar>
  );
});
