import { SearchOutlined } from '@ant-design/icons';
import { ElectronicKind } from '@circuit/electronics';
import { Input, Tooltip } from 'antd';
import React, { useMemo, useState } from 'react';
import { DoubleLeft, DoubleRight, Sidebar } from '../../base';
import * as Styles from './styles.less';
import { getCategoryData } from './utils';

export interface LeftSidebarProps {
  /** 选中器件 */
  onSelect?: (kind: ElectronicKind) => void;
}

export function LeftSidebar(props: LeftSidebarProps) {
  const title = '添加器件';
  const [filter, setFilter] = useState('');
  const categoryData = useMemo(() => getCategoryData(filter), [filter]);

  return (
    <Sidebar
      title={title}
      icons={{
        collapse: <DoubleLeft />,
        expand: <DoubleRight />,
      }}
      classNames={{
        wrapper: Styles.leftSidebarWrapper,
        sidebar: Styles.leftSidebar,
        collapsed: Styles.leftSidebarCollapsed,
      }}
    >
      <Input
        size="large"
        placeholder="搜索器件"
        prefix={<SearchOutlined className={Styles.searchIcon} />}
        className={Styles.searchInput}
        onChange={(e) => setFilter(e.target.value)}
      />
      <div className={Styles.categoryList}>
        {categoryData.map((category) => (
          <div key={category.key} className={Styles.categoryItem}>
            <div className={Styles.categoryTitle}>{category.title}</div>
            <div className={Styles.categoryComponents}>
              {category.components.map(({ key, title, component: { shape, kind } }) => (
                <Tooltip title={title} key={key} destroyTooltipOnHide>
                  <div className={Styles.componentItem} onMouseDown={() => props.onSelect?.(kind)}>
                    <svg viewBox="0 0 80 80">
                      <g transform="translate(40, 40)">
                        {shape.map(({ name: Tag, attribute }, i) => (
                          <Tag key={i} {...attribute} />
                        ))}
                      </g>
                    </svg>
                  </div>
                </Tooltip>
              ))}
            </div>
          </div>
        ))}
      </div>
    </Sidebar>
  );
}
