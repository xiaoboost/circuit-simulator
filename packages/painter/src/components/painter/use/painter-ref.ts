import { InjectContext } from '@circuit/inject';
import { RefObject, useContext } from 'react';
import { PainterScope } from '../../../context';
import { IPainterHTMLElement } from '../../../types';

/** 画布原始 DOM 引用服务 */
export function usePainterRefService(painterRef: RefObject<HTMLDivElement | null>) {
  const scopeContainer = useContext(InjectContext).get(PainterScope);
  const ServiceMap = scopeContainer?.context?.ServiceMap;

  // TODO: 不能放到 useEffect 中，那样的时序太晚了，之后再研究下怎么搞吧
  if (ServiceMap && !ServiceMap.has(IPainterHTMLElement)) {
    ServiceMap.set(IPainterHTMLElement, painterRef);
  }
}
