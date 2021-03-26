import React from 'react';
import classnames from 'classnames';
import styles from './index.styl';

import { TabStatus } from './constant';
import { isUndef } from 'src/utils/assert';

import {
  Tooltip as TooltipOrigin,
  Button,
} from 'antd';

import { useState } from 'react';
import { TooltipProps } from 'antd/es/tooltip';

import {
  PlusOutlined,
  RightCircleOutlined,
  LineChartOutlined,
  SettingOutlined,
} from '@ant-design/icons';

interface Props {
  isRun: boolean;
  runPercentage?: number;
  status?: TabStatus;
  onChange?(val: TabStatus): void;
}

const buttons = [
  {
    type: 'link' as const,
    icon: <PlusOutlined />,
    status: TabStatus.AddParts,
  },
  {
    type: 'text' as const,
    icon: <SettingOutlined />,
    status: TabStatus.Config,
  },
  {
    type: 'text' as const,
    icon: <LineChartOutlined />,
    status: TabStatus.Result,
  },
];

function Tooltip(props: TooltipProps) {
  const obj = { ...props };

  if (isUndef(obj.visible)) {
    delete obj.visible;
  }

  return <TooltipOrigin {...obj} />;
}

export function Tabs(props: Props) {
  const status = props.status ?? TabStatus.None;
  const [isRun, setRun] = useState(false);
  const clickBtn = (val: TabStatus) => {
    if (props.onChange) {
      props.onChange(val);
    }
  };

  return <section className={styles.menu}>
    {/* 运行 */}
    <Tooltip
      title='运行'
      placement='right'
      destroyTooltipOnHide
      visible={status === TabStatus.Run ? false : undefined}
    >
      <Button
        type='link'
        icon={<RightCircleOutlined />}
        loading={status === TabStatus.Run}
        className={styles.menuIconRun}
        onClick={() => clickBtn(TabStatus.Run)}
      />
    </Tooltip>

    {buttons.map((btn) => (
      <Button
        type={btn.type}
        icon={btn.icon}
        className={classnames({
          [styles.menuIconHighlight]: status === btn.status,
        })}
        onClick={() => clickBtn(btn.status)}
      />
    ))}
  </section>
}
