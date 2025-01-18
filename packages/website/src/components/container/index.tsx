import React from 'react';

// import { DrawingSheet } from 'src/components/drawing-sheet';
// import { SideMenu } from 'src/components/side-menu';
import * as Styles from './styles.css';
import { useInit } from './utils';


export function App() {
  useInit();

  return <div className={Styles.container}>
    测试
  </div>;

  // return <div className={styles.container}>
  //   <DrawingSheet />
  //   <SideMenu />
  // </div>;
}
