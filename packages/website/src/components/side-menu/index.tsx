import React from 'react';

import { aside } from './styles';
import { AddPart } from './add-part';
import { Config } from './config';
import { TabStatus } from './constant';
import { Move } from './components/move';
import { Tabs } from './components/tabs';
import { GraphViewer } from 'src/components/oscilloscope';
import { Solver, Config as ConfigStore } from 'src/store';

import { useWatcher } from '@xiao-ai/utils/use';
import { useState } from 'react';

export * from './types';

export function SideMenu() {
  const [result] = useWatcher(Solver.data);
  const [status, setStatus] = useState(TabStatus.AddParts);
  const [progress, setProgress] = useState(0);
  const isRun = status === TabStatus.Run;
  const onStatusChange = (status: TabStatus) => {
    // 运行状态不允许改变
    if (isRun) {
      return;
    }

    if (status === TabStatus.Run) {
      Solver.solve((progress) => setProgress(progress)).then(() => {
        setProgress(0);
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
    <Move visible={status === TabStatus.Osc} key={2}>
      <GraphViewer
        {...result}
        oscilloscopes={ConfigStore.oscilloscopes.data as string[][]}
        onClose={() => setStatus(TabStatus.None)}
      />
    </Move>
    <Tabs
      status={status}
      runProgress={progress}
      onChange={onStatusChange}
    />
  </aside>;
}
