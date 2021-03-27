import React from 'react';
import styles from './index.styl';

import { Tabs } from './tabs';
import { AddPart } from './add-part';
import { Config } from './config';
import { TabStatus } from './constant';
import { GraphViewer } from 'src/components/graph-viewer';

import { useState } from 'react';

export function SideMenu() {
  const [status, setStatus] = useState(TabStatus.AddParts);
  const [isRun, setIsRun] = useState(false);

  return <aside className={styles.aside}>
    <Tabs isRun={isRun} status={status} onChange={setStatus} />
    {(() => {
      if (status === TabStatus.AddParts) {
        return <AddPart />;
      }
      else if (status === TabStatus.Config) {
        return <Config />;
      }
      else if (status === TabStatus.Result) {
        return <GraphViewer />;
      }
      else {
        return <></>;
      }
    })()}
  </aside>;
}
