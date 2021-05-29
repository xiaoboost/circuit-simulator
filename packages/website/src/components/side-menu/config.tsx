import React from 'react';

import { Tooltip } from 'antd';
import { part } from './styles';
import { Panel } from './components/panel';

export function Config() {
  return <Panel title='模拟设置' subtitle='Simulation Settings'>
    config
  </Panel>;
}
