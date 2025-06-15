import {
  IRendererHOC,
  IRendererData,
  PropsWithHocParams,
  RENDERER_HOC,
} from '@circuit/inject';
import { useMemo, FC } from 'react';
import { useHook } from './index';

/** 组合高阶渲染器 */
export function useComposeHOC<T extends object>(core: IRendererData<T>) {
  const hooks = useHook<IRendererHOC<T>>(RENDERER_HOC, 'asc');
  const Component = useMemo(() => {
    const filteredHooks = hooks.filter(hook => !hook.use || hook.use(core));

    let component = core.Render as FC<PropsWithHocParams<T>>;

    for (const hook of filteredHooks) {
      component = hook.RenderHOC(component);
    }

    return component;
  }, [core, ...hooks]);

  return {
    Component,
    getKey: core.getKey,
  };
}
