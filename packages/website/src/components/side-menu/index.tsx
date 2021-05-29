import React from 'react';
// import styles from './index.styl';

import { aside } from './styles';
import { AddPart } from './add-part';
import { Config } from './config';
import { TabStatus } from './constant';
import { Move } from './components/move';
import { Tabs } from './components/tabs';
import { Direction } from '@circuit/math';
// import { GraphViewer } from 'src/components/graph-viewer';

import { useState } from 'react';

export function SideMenu() {
  const [status, setStatus] = useState(TabStatus.None);
  const [isRun, setIsRun] = useState(false);

  return <aside className={aside.aside}>
    <Move visible={status === TabStatus.AddParts}>
      <AddPart />
    </Move>
    <Move visible={status === TabStatus.Config} >
      <Config />
    </Move>
    <Tabs isRun={isRun} status={status} onChange={setStatus} />
  </aside>;
}
