import { Painter } from '@circuit/painter';
import React from 'react';

import { Header } from '../header';
import * as Styles from './styles.css';
import { useInit } from './utils';

export function App() {
  useInit();

  return <div className={Styles.container}>
    <Header />
    <Painter lines={[]} parts={[]} />
  </div>;
}
