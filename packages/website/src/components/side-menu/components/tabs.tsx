import React from 'react';

import { tabStyle } from './styles';
import { TabStatus } from '../constant';
import { DarkGreen } from 'src/styles';
import { isUndef, stringifyClass } from '@xiao-ai/utils';
import { Tooltip as TooltipOrigin } from 'antd';
import { TooltipProps } from 'antd/es/tooltip';

import {
  PlusOutlined,
  CaretRightOutlined,
  LineChartOutlined,
  SettingOutlined,
  LoadingOutlined,
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
  const isRun = status === TabStatus.Run;
  const clickBtn = (val: TabStatus) => {
    if (props.onChange) {
      props.onChange(val);
    }
  };

  return <section className={tabStyle.tabs}>
    <Tooltip
      title='运行'
      placement='right'
      destroyTooltipOnHide
      visible={isRun ? false : undefined}
    >
      <div className={stringifyClass(tabStyle.btn, tabStyle.runBtn)}>
        {isRun
          ? <LoadingOutlined style={{ color: DarkGreen, fontSize: 18 }} />
          : <CaretRightOutlined style={{ color: DarkGreen, fontSize: 36 }} />
        }
      </div>
    </Tooltip>

    {buttons.map((btn, i) => (
      <div
        key={i}
        className={stringifyClass(tabStyle.btn, {
          [tabStyle.highlight]: status === btn.status,
        })}
        onClick={() => clickBtn(btn.status)}
      >
        {btn.icon}
      </div>
    ))}
  </section>
}
