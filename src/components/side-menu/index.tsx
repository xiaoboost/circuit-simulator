import React from 'react';
import styles from './index.styl';

import { Tabs } from './tabs';
import { AddPart } from './add-part';
import { Config } from './config';
import { TabStatus } from './constant';
import { GraphViewer } from 'src/components/graph-viewer';

import { useState } from 'react';

const statusMap = {
  [TabStatus.AddParts]: <AddPart />,
  [TabStatus.Config]: <Config />,
  [TabStatus.Result]: <GraphViewer />,
};

export function SideMenu() {
  const [status, setStatus] = useState(TabStatus.None);
  const [isRun, setIsRun] = useState(false);

  return <aside className={styles.aside}>
    <Tabs isRun={isRun} status={status} onChange={setStatus} />
    {statusMap[status] ?? ''}
  </aside>;
}
