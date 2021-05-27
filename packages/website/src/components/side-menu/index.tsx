import React from 'react';
// import styles from './index.styl';

import { aside } from './styles';
import { useMemo } from 'react';
import { Tabs } from './tabs';
import { AddPart } from './add-part';
import { Config } from './config';
import { TabStatus } from './constant';
import { GraphViewer } from 'src/components/graph-viewer';

import { useState } from 'react';

export function SideMenu() {
  const classNames = aside();
  const [status, setStatus] = useState(TabStatus.AddParts);
  const [isRun, setIsRun] = useState(false);
  const addPart = useMemo(() => <AddPart />, []);
  const config = useMemo(() => <Config />, []);
  const graphViewer = useMemo(() => <GraphViewer />, []);

  return <aside className={classNames.aside}>
    <Tabs isRun={isRun} status={status} onChange={setStatus} />
    {(() => {
      if (status === TabStatus.AddParts) {
        return addPart;
      }
      else if (status === TabStatus.Config) {
        return config;
      }
      else if (status === TabStatus.Result) {
        return graphViewer;
      }
      else {
        return <></>;
      }
    })()}
  </aside>;
}
