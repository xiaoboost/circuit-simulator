import React from 'react';

import { tabStyle } from './styles';
import { TabStatus } from '../constant';
import { DarkGreen } from 'src/styles';
import { solverData } from 'src/store';
import { useWatcher } from '@xiao-ai/utils/use';
import { isUndef, stringifyClass } from '@xiao-ai/utils';
import { Tooltip as TooltipOrigin, Button } from 'antd';
import { TooltipProps } from 'antd/es/tooltip';

import {
  PlusOutlined,
  CaretRightOutlined,
  LineChartOutlined,
  SettingOutlined,
  LoadingOutlined,
} from '@ant-design/icons';

interface Props {
  status: TabStatus;
  runProgress?: number;
  onChange?(val: TabStatus): void;
}

/** 是否保存上次仿真结果 */
const hasSolverResult = solverData.computed((data) => data.times.length > 0);

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
    status: TabStatus.Osc,
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
  const progress = props.runProgress ?? 0;
  const status = props.status ?? TabStatus.None;
  const isRun = progress > 0 && status === TabStatus.Run;
  const [hasLast] = useWatcher(hasSolverResult);
  const clickBtn = (val: TabStatus) => {
    if (props.onChange) {
      props.onChange(val);
    }
  };

  return <section className={tabStyle.tabs}>
    <Tooltip
      title={progress > 0 ? `${progress}%` : '运行'}
      placement='left'
      destroyTooltipOnHide
      visible={isRun ? true : undefined}
    >
      <Button
        type='text'
        disabled={isRun}
        className={stringifyClass(tabStyle.btn, tabStyle.runBtn)}
        onClick={() => clickBtn(TabStatus.Run)}
      >
        {isRun
          ? <LoadingOutlined style={{ color: DarkGreen, fontSize: 18 }} />
          : <CaretRightOutlined style={{ color: DarkGreen, fontSize: 36 }} />
        }
      </Button>
    </Tooltip>

    {buttons.map((btn, i) => (
      <Button
        key={i}
        type='text'
        disabled={isRun || (btn.status === TabStatus.Osc && !hasLast)}
        className={stringifyClass(tabStyle.btn, {
          [tabStyle.highlight]: status === btn.status,
        })}
        onClick={() => clickBtn(btn.status)}
      >
        {btn.icon}
      </Button>
    ))}
  </section>
}
