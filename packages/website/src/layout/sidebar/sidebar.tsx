import { stringifyClass as sc } from '@xiao-ai/utils';
import { Button } from 'antd';
import React from 'react';
import * as Styles from './styles.less';

export interface SidebarProps {
  title: React.ReactNode;
  width?: number;
  children: React.ReactNode;
  isCollapsed: boolean;
  onCollapse: (isCollapsed: boolean) => void;
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
  isCollapsed,
  onCollapse,
  classNames,
  style,
  icons,
  width = 300,
}: SidebarProps) {
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
            <Button icon={icons?.expand} onClick={() => onCollapse(false)}>{title}</Button>
          </div>
        )
        : (
          <div
            className={sc(Styles.sidebar, classNames?.sidebar)}
            style={{ width }}
          >
            <div className={Styles.sidebarHeader}>
              <span className={Styles.sidebarHeaderTitle}>{title}</span>
              <span
                className={Styles.sidebarHeaderIcon}
                onClick={() => onCollapse(true)}
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
