import {
  DoubleLeftOutlined as DoubleLeft,
  DoubleRightOutlined as DoubleRight,
} from '@circuit/icons';
import { LAYOUT_SERVICE } from '@circuit/shared';
import { stringifyClass as sc } from '@xiao-ai/utils';
import { Button } from 'antd';
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
    <aside
      className={sc(Styles.sidebarWrapper, Styles.rightSidebarWrapper, {
        [Styles.sidebarCollapsed]: isCollapsed,
      })}
    >
      {isCollapsed
        ? (
          <div className={Styles.rightSidebarCollapsed}>
            <Button icon={<DoubleLeft />} onClick={() => setIsCollapsed(false)}>
              {render.title}
            </Button>
          </div>
        )
        : (
          <Sidebar
            title={render.title}
            onIcon={() => setIsCollapsed(true)}
            icon={<DoubleRight />}
            className={Styles.rightSidebar}
          >
            <render.Render />
          </Sidebar>
        )
      }
    </aside>
  );
});
