import {
  DoubleLeftOutlined as DoubleLeft,
  DoubleRightOutlined as DoubleRight,
} from '@circuit/icons';
import React from 'react';
import { useHook } from '../../context';
import { RIGHT_SIDEBAR_RENDER } from '../../types';
import { Sidebar } from './sidebar';
import * as Styles from './styles.less';

export const RightSidebar = React.memo(function RightSidebar() {
  // TODO: 目前只有一个
  const render = useHook(RIGHT_SIDEBAR_RENDER)[0];

  return (
    <Sidebar
      title={<render.title />}
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
