import { stringifyClass as sc } from '@xiao-ai/utils';
import React from 'react';
import * as Styles from './styles.less';

export interface SidebarProps {
  title: React.ReactNode;
  width?: number;
  children: React.ReactNode;
  onIcon?: () => void;
  icon?: React.ReactNode;
  style?: React.CSSProperties;
  className?: string;
}

export function Sidebar({
  className,
  title,
  children,
  onIcon,
  icon,
  style,
  width = 300,
}: SidebarProps) {
  return (
    <div
      className={sc(Styles.sidebar, className)}
      style={{
        width,
        ...style,
      }}
    >
      <div className={Styles.sidebarHeader}>
        <span className={Styles.sidebarHeaderTitle}>{title}</span>
        {icon && (
          <span
            className={Styles.sidebarHeaderIcon}
            onClick={onIcon}
          >
            {icon}
          </span>
        )}
      </div>
      <div className={Styles.sidebarContent}>
        {children}
      </div>
    </div>
  );
}
