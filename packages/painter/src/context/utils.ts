
import { ComponentType } from 'react';
import {
  IRendererHOC,
  PropsWithRendererKey,
} from '../types';

/** 组合高阶渲染器 */
export function composeRendererHOC<T>(ChildRender: ComponentType<T>, hocHooks: IRendererHOC[]) {
  if (hocHooks.length === 0) {
    return ChildRender;
  }

  return hocHooks.reduce((acc, cur) => {
    return cur.RenderHOC(acc);
  }, ChildRender as ComponentType<PropsWithRendererKey<T>>);
}
