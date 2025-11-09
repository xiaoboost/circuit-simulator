import {
  ILoggerService,
  GlobalMarker,
} from '@circuit/shared';
import React, { useEffect } from 'react';
import {
  useInjectInstall,
  InjectContext,
  useService,
  useLifeCycle,
} from '../../context';
import { Header } from '../header';
import { LeftSidebar } from '../left-sidebar';
import { MainArea } from '../main-area';
import { Overlay } from '../overlay';
import { RightSidebar } from '../right-sidebar';
import { useHotkeyDriver } from './driver';
import { removeLoading } from './loading';
import * as Styles from './styles.less';

const LoggerName = '应用';

function getStartUpDuration() {
  performance.mark(GlobalMarker.startUp);
  const measure = performance.measure(GlobalMarker.startUp);
  return Math.floor(measure.duration);
}

function Layout() {
  const [isRootInitialized] = useLifeCycle();
  const logger = useService(ILoggerService);

  useHotkeyDriver();

  useEffect(() => {
    if (isRootInitialized) {
      logger.info(LoggerName, `应用初始化完成，耗时 ${getStartUpDuration()}ms`);
      removeLoading();
    }
  }, [isRootInitialized]);

  if (!isRootInitialized) {
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
      <Overlay />
    </article>
  );
}

function Initialization() {
  const [pluginInitialized] = useInjectInstall();

  if (!pluginInitialized) {
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
