import React from 'react';

import { aside } from './styles';
import { AddPart } from './add-part';
import { Config } from './config';
import { TabStatus } from './constant';
import { Move } from './components/move';
import { Tabs } from './components/tabs';
import { parts, lines, end, step } from 'src/store';
// import { GraphViewer } from 'src/components/graph-viewer';

import { solve } from '@circuit/solver';
import { useState } from 'react';

export * from './types';

export function SideMenu() {
  const [status, setStatus] = useState(TabStatus.AddParts);
  const [isRun, setRun] = useState(false);
  const onStatusChange = (status: TabStatus) => {
    // 运行状态不允许改变
    if (isRun) {
      return;
    }

    if (status === TabStatus.Run) {
      setRun(true);
      solve({
        parts: parts.data.slice(),
        lines: lines.data.slice(),
        simulation: {
          end: end.data,
          step: step.data,
        },
        onProgress: (process) => {
          console.log(process);
          debugger;
        },
      }).then(() => {
        setRun(false);
        setStatus(TabStatus.Osc);
      });
    }

    setStatus(status);
  };

  return <aside className={aside.aside}>
    <Move visible={status === TabStatus.AddParts} key={0}>
      <AddPart />
    </Move>
    <Move visible={status === TabStatus.Config} key={1}>
      <Config />
    </Move>
    <Tabs isRun={isRun} status={status} onChange={onStatusChange} />
  </aside>;
}
