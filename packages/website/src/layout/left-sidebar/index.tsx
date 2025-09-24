import { ILayoutService } from '@circuit/shared';
import { stringifyClass as sc } from '@xiao-ai/utils';
import { Tooltip } from 'antd';
import React, { useMemo } from 'react';
import { useHook, useService, useWatcher } from '../../context';
import { ILeftSidebarRender } from '../../types';
import { Sidebar } from '../right-sidebar/sidebar';
import * as Styles from './styles.less';

export const LeftSidebar = React.memo(function RightSidebar() {
  const renders = useHook(ILeftSidebarRender);
  const layoutService = useService(ILayoutService);
  const [activeTab, setActiveTab] = useWatcher(layoutService.leftSidebarActiveTab);
  const sidebar = useMemo(() => {
    return renders.find((item) => item.name === activeTab);
  }, [activeTab, renders]);
  const onSelect = (name: string) => {
    setActiveTab(name === activeTab ? '' : name);
  };

  return (
    <aside className={Styles.leftSidebarWrapper}>
      <div className={Styles.tabListWrapper}>
        <div className={Styles.tabList}>
          {renders.map((item) => (
            <Tooltip
              title={item.title}
              key={item.name}
              placement="right"
              destroyOnHidden
            >
              <div
                key={item.name}
                className={sc(Styles.tabItem, {
                  [Styles.selected]: activeTab === item.name,
                })}
                onClick={() => onSelect(item.name)}
              >
                {item.icon}
              </div>
            </Tooltip>
          ))}
        </div>
      </div>
      {sidebar && (
        <Sidebar title={sidebar.title}>
          <sidebar.Render />
        </Sidebar>
      )}
    </aside>
  );
});
