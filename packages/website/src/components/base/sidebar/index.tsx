import { stringifyClass as sc } from '@xiao-ai/utils';
import React from 'react';
import * as Styles from './styles.less';

export interface SidebarProps {
  title: string;
  icon: React.ReactNode;
  children: React.ReactNode;
  className?: string;
  style?: React.CSSProperties;
  onIconClick?: () => void;
}

export function Sidebar({ title, icon, children, onIconClick, className, style }: SidebarProps) {
  return (
    <aside className={sc(Styles.sidebar, className)} style={style}>
      <div className={Styles.sidebarHeader}>
        <span className={Styles.sidebarHeaderTitle}>{title}</span>
        <span className={Styles.sidebarHeaderIcon} onClick={onIconClick}>{icon}</span>
      </div>
      <div className={Styles.sidebarContent}>
        {children}
      </div>
    </aside>
  );
}
