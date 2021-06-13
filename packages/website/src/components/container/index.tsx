import React from 'react';

import { styles } from './styles';
import { useInit } from './utils';

import { SideMenu } from 'src/components/side-menu';
import { DrawingSheet } from 'src/components/drawing-sheet';

export function App() {
  useInit();

  return <div className={styles.container}>
    <DrawingSheet />
    <SideMenu />
  </div>;
}
