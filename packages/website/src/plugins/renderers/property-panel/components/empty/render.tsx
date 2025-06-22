import { Empty } from '@circuit/icons';
import React from 'react';
import * as Styles from './styles.less';

export function EmptyPropertyPanel() {
  return (
    <div className={Styles.empty}>
      <div className={Styles.icon}>
        <Empty />
      </div>
      <div className={Styles.title}>请选择器件以浏览属性</div>
    </div>
  );
}
