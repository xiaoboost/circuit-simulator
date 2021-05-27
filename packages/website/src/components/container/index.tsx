import React from 'react';

import { styles } from './styles';
import { useInitMap } from './utils';

// import { SideMenu } from 'src/components/side-menu';
// import { DrawingSheet } from 'src/components/drawing-sheet';

export function App() {
  useInitMap();

  return <div className={styles.container}>
    测试文本
    {/* <DrawingSheet /> */}
    {/* <SideMenu /> */}
  </div>;
}
