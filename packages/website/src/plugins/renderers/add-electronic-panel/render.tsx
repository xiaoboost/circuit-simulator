import { SearchOutlined } from '@circuit/icons';
import {
  STREAM_SERVICE,
  GlobalStreamConstant as Constant,
} from '@circuit/shared';
import { ElectronicKind } from '@circuit/types';
import { Input, Tooltip } from 'antd';
import React, { useMemo, useState } from 'react';
import { useService } from '../../../context';
import * as Styles from './styles.less';
import { getCategoryData } from './utils';

export const AddElectronicPanelRender = React.memo(function AddElectronicPanelRender() {
  const [filter, setFilter] = useState('');
  const categoryData = useMemo(() => getCategoryData(filter), [filter]);
  const stream = useService(STREAM_SERVICE);
  const onSelect = (kind: ElectronicKind) => {
    // 触发创建器件事件
    stream.get<Constant.NewPartPayload>(Constant.NewPart).emit({
      kind,
    });
  };

  return (
    <>
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
                <Tooltip title={title} key={key} destroyOnHidden>
                  <div className={Styles.componentItem} onMouseDown={() => onSelect(kind)}>
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
    </>
  );
});
