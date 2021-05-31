import React from 'react';

import { aside } from './styles';
import { AddPart } from './add-part';
import { Config } from './config';
import { TabStatus } from './constant';
import { Move } from './components/move';
import { Tabs } from './components/tabs';
// import { GraphViewer } from 'src/components/graph-viewer';

import { useState } from 'react';

export * from './types';

export function SideMenu() {
  const [status, setStatus] = useState(TabStatus.AddParts);
  const isRun = status === TabStatus.Run;

  return <aside className={aside.aside}>
    <Move visible={status === TabStatus.AddParts} key={0}>
      <AddPart />
    </Move>
    <Move visible={status === TabStatus.Config} key={1}>
      <Config />
    </Move>
    <Tabs isRun={isRun} status={status} onChange={setStatus} />
  </aside>;
}
