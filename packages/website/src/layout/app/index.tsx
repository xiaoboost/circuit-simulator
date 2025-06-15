import React from 'react';
import { useInjectInstall, InjectContext } from '../../context';
import { Header } from '../header';
import { MainArea } from '../main-area';
import { LeftSidebar, RightSidebar } from '../sidebar';
import * as Styles from './styles.less';

export function App() {
  useInjectInstall();

  return (
    <InjectContext.Provider value={new Map()}>
      <article className={Styles.layout}>
        <Header />
        <div className={Styles.container}>
          <LeftSidebar />
          <MainArea />
          <RightSidebar />
        </div>
      </article>
    </InjectContext.Provider>
  );
}
