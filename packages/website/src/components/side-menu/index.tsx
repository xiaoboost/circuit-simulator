import React from 'react';

import { aside } from './styles';
import { AddPart } from './add-part';
import { Config } from './config';
import { TabStatus } from './constant';
import { Move } from './components/move';
import { Tabs } from './components/tabs';
import { GraphViewer } from 'src/components/oscilloscope';

import { solve } from '@circuit/solver';
import { delay } from '@xiao-ai/utils';
import { useWatcher } from '@xiao-ai/utils/use';
import { useState } from 'react';

import {
  parts,
  lines,
  end,
  step,
  oscilloscopes,
  solverData,
} from 'src/store';

export * from './types';

export function SideMenu() {
  const [status, setStatus] = useState(TabStatus.AddParts);
  const [result, setResult] = useWatcher(solverData);
  const [progress, setProgress] = useState(0);
  const isRun = status === TabStatus.Run;
  const onStatusChange = (status: TabStatus) => {
    // 运行状态不允许改变
    if (isRun) {
      return;
    }

    if (status === TabStatus.Run) {
      solve({
        parts: parts.data.slice(),
        lines: lines.data.slice(),
        end: end.data,
        step: step.data,
        onProgress: (progress) => {
          setProgress(progress);
          return delay();
        },
      }).then((data) => {
        setProgress(0);
        setStatus(TabStatus.Osc);
        setResult({
          oscilloscopes: oscilloscopes.data.slice(),
          ...data,
        });
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
