import { Painter } from '@circuit/painter';
import React from 'react';

import { Header } from '../header';

// import { parts, lines } from './example';

import * as Styles from './styles.css';
import {
  useStateInit,
  useRemoveLoading,
} from './use';

export function App() {
  const state = useStateInit();

  useRemoveLoading(Boolean(state));

  if (!state) {
    return null;
  }

  const {
    parts,
    lines,
  } = state.getState();

  return <div className={Styles.container}>
    <Header />
    <Painter lines={lines} parts={parts} style={{ flexGrow: 1 }} />
  </div>;
}
