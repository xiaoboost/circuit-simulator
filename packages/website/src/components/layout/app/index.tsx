import { Painter } from '@circuit/painter';
import React from 'react';
import { Header } from '../header';
import { LeftSidebar } from '../left-sidebar';
import { RightSidebar } from '../right-sidebar';
import * as Styles from './styles.less';
import {
  useDataInit,
  usePainterState,
  useRemoveLoading,
} from './use';


export function App() {
  const data = useDataInit();
  const removeLoading = useRemoveLoading();
  const painterState = usePainterState(data);

  return (
    <article className={Styles.layout}>
      <Header />
      <div className={Styles.container}>
        <LeftSidebar />
        <div className={Styles.mainArea}>
        {data
          ? <Painter
            {...painterState}
            onReady={removeLoading}
          />
          : <div>Loading</div>
        }
        </div>
        <RightSidebar />
      </div>

    </article>
  );
}
