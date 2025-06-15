import { stringifyClass as sc } from '@xiao-ai/utils';
import { Button } from 'antd';
import React, { useState } from 'react';
import * as Styles from './styles.less';

export interface SidebarProps {
  title: React.ReactNode;
  children: React.ReactNode;
  style?: React.CSSProperties;
  icons?: {
    collapse?: React.ReactNode;
    expand?: React.ReactNode;
  };
  classNames?: {
    wrapper?: string;
    sidebar?: string;
    collapsed?: string;
  };
}

export function Sidebar({
  title,
  children,
  classNames,
  style,
  icons,
}: SidebarProps) {
  const [isCollapsed, setIsCollapsed] = useState(false);

  return (
    <aside
      className={sc(Styles.sidebarWrapper, classNames?.wrapper, {
        [Styles.sidebarCollapsed]: isCollapsed,
      })}
      style={style}
    >
      {isCollapsed
        ? (
          <div className={classNames?.collapsed}>
            <Button icon={icons?.expand} onClick={() => setIsCollapsed(false)}>{title}</Button>
          </div>
        )
        : (
          <div className={sc(Styles.sidebar, classNames?.sidebar)}>
            <div className={Styles.sidebarHeader}>
              <span className={Styles.sidebarHeaderTitle}>{title}</span>
              <span
                className={Styles.sidebarHeaderIcon}
                onClick={() => setIsCollapsed(true)}
              >
                {icons?.collapse}
              </span>
            </div>
            <div className={Styles.sidebarContent}>
              {children}
            </div>
          </div>
        )
      }
    </aside>
  );
}
