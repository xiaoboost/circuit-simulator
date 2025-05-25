import React from 'react';
import { DoubleLeft } from '../icons';
import * as Styles from './styles.less';

export function LeftSidebar() {
  return (
    <aside className={Styles.leftSidebar}>
      <div className={Styles.leftSidebarHeader}>
        <span className={Styles.leftSidebarHeaderTitle}>添加器件</span>
        <DoubleLeft />
      </div>
      <div>
        内容
      </div>
    </aside>
  );
}
