import React from 'react';
import { DoubleRight, Sidebar } from '../../base';
import * as Styles from './styles.less';

export function RightSidebar() {
  return (
    <Sidebar
      title="器件属性"
      icon={<DoubleRight />}
      className={Styles.rightSidebar}
      onIconClick={() => {
        console.log('icon clicked');
      }}
    >
      属性
    </Sidebar>
  );
}
