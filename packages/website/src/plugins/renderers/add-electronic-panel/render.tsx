import { SearchOutlined } from '@circuit/icons';
import {
  CONFIGURATION_SERVICE,
  LOGGER_SERVICE,
  STREAM_SERVICE,
  GlobalStreamConstant as Constant,
} from '@circuit/shared';
import { ElectronicKind } from '@circuit/types';
import { Input, Tooltip, message } from 'antd';
import React, { useMemo, useState } from 'react';
import { useService } from '../../../context';
import * as Styles from './styles.less';
import { getCategoryData } from './utils';

const LoggerName = '添加器件面板';

export function AddElectronicPanelRender() {
  const [filter, setFilter] = useState('');
  const categoryData = useMemo(() => getCategoryData(filter), [filter]);
  const stream = useService(STREAM_SERVICE);
  const configuration = useService(CONFIGURATION_SERVICE);
  const logger = useService(LOGGER_SERVICE);
  const onSelect = (kind: ElectronicKind) => {
    if (configuration.movePainterMode.data) {
      const msg = '移动图纸模式下不能创建器件';
      logger.info(LoggerName, msg);
      message.warning(msg);
      return;
    }

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
}
