import { RefObject, useContext } from 'react';
import { PainterContext } from '../../../context/context';
import { PAINTER_HTML_ELEMENT } from '../../../types';

/** 画布原始 DOM 引用服务 */
export function usePainterRefService(painterRef: RefObject<HTMLDivElement | null>) {
  const { ServiceMap } = useContext(PainterContext);

  // TODO: 不能放到 useEffect 中，那样的时序太晚了，之后再研究下怎么搞吧
  if (!ServiceMap.has(PAINTER_HTML_ELEMENT)) {
    ServiceMap.set(PAINTER_HTML_ELEMENT, painterRef);
  }
}
