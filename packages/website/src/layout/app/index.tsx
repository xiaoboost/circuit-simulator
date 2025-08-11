import { RootScope } from '@circuit/inject';
import { LOGGER_SERVICE } from '@circuit/shared';
import React, { useContext } from 'react';
import { useInjectInstall, InjectContext } from '../../context';
import { Header } from '../header';
import { MainArea } from '../main-area';
import { LeftSidebar, RightSidebar } from '../sidebar';
import { removeLoading } from './loading';
import * as Styles from './styles.less';

function Layout() {
  const context = useContext(InjectContext);
  const { isInitialized } = useInjectInstall(() => {
    setTimeout(() => {
      removeLoading();
      // 直接子外面用 useService 是不行的，因为只有初始化完成之后才能拿到服务
      context.get(RootScope)?.context.ServiceMap.get(LOGGER_SERVICE)?.info('基座', '初始化完成');

      if (process.env.NODE_ENV === 'development') {
        (window as any).$InjectionContext = context;
      }
    }, 500);
  });

  if (!isInitialized) {
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
