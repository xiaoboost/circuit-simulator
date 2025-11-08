import { InjectContext } from '@circuit/inject';
import { RefObject, useContext, useMemo } from 'react';
import { PainterScope } from '../../../context';
import { IPainterHTMLElement } from '../../../types';

/** 画布原始 DOM 引用服务 */
export function usePainterRefService(painterRef: RefObject<HTMLDivElement | null>) {
  const scopeContainer = useContext(InjectContext).get(PainterScope);

  // 这里利用 useMemo 会立即运行的特性，并且设置没有依赖，表示只会运行一次
  useMemo(() => {
    const ServiceMap = scopeContainer?.context?.ServiceMap;

    if (ServiceMap && !ServiceMap.has(IPainterHTMLElement)) {
      ServiceMap.set(IPainterHTMLElement, painterRef);
    }
  }, []);
}
