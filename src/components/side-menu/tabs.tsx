import React from 'react';

import { tabs } from './styles';
import { TabStatus } from './constant';
import { isUndef } from '@utils/assert';
import { stringifyClass } from '@utils/string';

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
  const classNames = tabs();
  const status = props.status ?? TabStatus.None;
  const [isRun, setRun] = useState(false);
  const clickBtn = (val: TabStatus) => {
    if (props.onChange) {
      props.onChange(val);
    }
  };

  return <section className={classNames.tabs}>
    <Tooltip
      title='运行'
      placement='right'
      destroyTooltipOnHide
      visible={status === TabStatus.Run ? false : undefined}
    >
      <Button
        type='link'
        size='large'
        icon={<RightCircleOutlined />}
        className={classNames.runIcon}
        loading={status === TabStatus.Run}
        onClick={() => clickBtn(TabStatus.Run)}
      />
    </Tooltip>

    {buttons.map((btn, i) => (
      <Button
        key={i}
        type={btn.type}
        icon={btn.icon}
        size='large'
        className={stringifyClass(classNames.tabIcon, {
          [classNames.highlight]: status === btn.status,
        })}
        onClick={() => clickBtn(btn.status)}
      />
    ))}
  </section>
}
