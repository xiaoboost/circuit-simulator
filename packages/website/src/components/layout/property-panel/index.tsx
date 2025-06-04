import { PartStructuredData } from '@circuit/electronics';
import React from 'react';
import { DoubleLeft, DoubleRight, Sidebar } from '../../base';
import * as Styles from './styles.less';

export interface PropertyPanelProps {
  /** 选中的器件 */
  selected: PartStructuredData[];
}

export function PropertyPanel(props: PropertyPanelProps) {
  const title = '器件属性';
  return (
    <Sidebar
      title={title}
      icons={{
        collapse: <DoubleRight />,
        expand: <DoubleLeft />,
      }}
      classNames={{
        wrapper: Styles.propertyPanelWrapper,
        sidebar: Styles.propertyPanel,
        collapsed: Styles.propertyPanelCollapsed,
      }}
    >
      属性
    </Sidebar>
  );
}
