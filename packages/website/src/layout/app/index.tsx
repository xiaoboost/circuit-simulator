import React, { useState } from 'react';
import { useInjectInstall, InjectContext } from '../../context';
import { Header } from '../header';
import { MainArea } from '../main-area';
import { LeftSidebar, RightSidebar } from '../sidebar';
import { removeLoading } from './loading';
import * as Styles from './styles.less';

function Layout() {
  const [isReady, setIsReady] = useState(false);

  useInjectInstall(() => {
    setIsReady(true);
    removeLoading();
  });

  if (!isReady) {
    return null;
  }

  return (
    <article className={Styles.layout}>
      <Header />
      <div className={Styles.container}>
        <LeftSidebar />
        <MainArea />
        <RightSidebar />
      </div>
    </article>
  );
}

export function App() {
  return (
    <InjectContext.Provider value={new Map()}>
      <Layout />
    </InjectContext.Provider>
  );
}
