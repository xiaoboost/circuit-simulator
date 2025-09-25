import { RootScope } from '@circuit/inject';
import { ILoggerService } from '@circuit/shared';
import React, { useContext } from 'react';
import { useInjectInstall, InjectContext } from '../../context';
import { Header } from '../header';
import { LeftSidebar } from '../left-sidebar';
import { MainArea } from '../main-area';
import { Overlay } from '../overlay';
import { RightSidebar } from '../right-sidebar';
import { useHotkeyDriver } from './driver';
import { removeLoading } from './loading';
import * as Styles from './styles.less';

function Layout() {
  useHotkeyDriver();

  return (
    <article className={Styles.layout}>
      <Header />
      <div className={Styles.container}>
        <LeftSidebar />
        <MainArea />
        <RightSidebar />
      </div>
      <Overlay />
    </article>
  );
}

function Initialization() {
  const context = useContext(InjectContext);
  const { isInitialized } = useInjectInstall(() => {
    setTimeout(() => {
      removeLoading();
      // 直接子外面用 useService 是不行的，因为只有初始化完成之后才能拿到服务
      context.get(RootScope)?.context.ServiceMap.get(ILoggerService)?.info('基座', '初始化完成');

      if (process.env.NODE_ENV === 'development') {
        (window as any).$InjectionContext = context;
      }
    }, 500);
  });

  if (!isInitialized) {
    return null;
  }

  return <Layout />;
}

export function App() {
  return (
    <InjectContext.Provider value={new Map()}>
      <Initialization />
    </InjectContext.Provider>
  );
}
