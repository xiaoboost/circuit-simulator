import { Painter } from '@circuit/painter';
import React from 'react';

import { Header } from '../header';

import * as Styles from './styles.css';
import {
  useDataInit,
  useStateController,
  useRemoveLoading,
} from './use';

export function App() {
  const initData = useDataInit();
  const [state, commit] = useStateController(initData);
  const isReady = Boolean(initData && state);

  useRemoveLoading(isReady);

  if (!state) {
    return null;
  }

  return (
    <div className={Styles.container}>
      <Header />
      <Painter
        lines={state.lines ?? []}
        parts={state.parts ?? []}
        style={{ flexGrow: 1 }}
        commit={commit}
      />
    </div>
  );
}
