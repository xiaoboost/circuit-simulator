import { SearchOutlined } from '@ant-design/icons';
import { Input, Tooltip } from 'antd';
import React, { useMemo, useState } from 'react';
import { DoubleLeft, Sidebar } from '../../base';
import * as Styles from './styles.less';
import { getCategoryData } from './utils';

export function LeftSidebar() {
  const [filter, setFilter] = useState('');
  const categoryData = useMemo(() => getCategoryData(filter), [filter]);

  return (
    <Sidebar
      title="添加器件"
      icon={<DoubleLeft />}
      className={Styles.leftSidebar}
      onIconClick={() => {
        console.log('icon clicked');
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
              {category.components.map(({ key, title, component: { shape } }) => (
                <Tooltip title={title} key={key} destroyTooltipOnHide>
                  <div className={Styles.componentItem}>
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
