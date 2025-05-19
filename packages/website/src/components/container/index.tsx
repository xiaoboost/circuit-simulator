import { Painter } from '@circuit/painter';
import React from 'react';
import { Header } from '../header';
import { container } from './styles.css';
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
    <div className={container}>
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
