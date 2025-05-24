import { Painter } from '@circuit/painter';
import React from 'react';
import { Header } from '../header';
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
    <div className={Styles.container}>
      <Header />
      {data
        ? <Painter
          {...painterState}
          onReady={removeLoading}
        />
        : <div>Loading</div>
      }
    </div>
  );
}
