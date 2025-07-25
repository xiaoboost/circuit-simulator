import {
  IRendererHOC,
  IRendererData,
  PropsWithHocParams,
} from '@circuit/inject';
import { FC } from 'react';

/** 组合高阶渲染器 */
export function composeHOC<T extends object>(core: IRendererData<T>, hooks: IRendererHOC<T>[]) {
  const filteredHooks = hooks.filter(hook => !hook.use || hook.use(core));

  let Component = core.Render as FC<PropsWithHocParams<T>>;

  for (const hook of filteredHooks) {
    Component = hook.RenderHOC(Component);
  }

  return {
    Component,
    getKey: core.getKey,
  };
}
