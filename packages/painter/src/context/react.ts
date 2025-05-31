import { createSorter } from '@circuit/shared';
import HotKey, { KeyHandler } from 'hotkeys-js';
import { useEffect, useContext, useMemo, FC } from 'react';
import {
  HookType,
  ServiceType,
  HotKeyOptions,
  IRendererHOC,
  IRendererData,
  PropsWithHocParams,
  RENDERER_HOC,
  PAINTER_HTML_ELEMENT,
} from '../types';
import { PainterContext } from './context';
import { ServiceTypeWithKey } from './types';

/** 获取画布服务 */
export function usePainterService<T extends ServiceType>(key: ServiceTypeWithKey<T>) {
  const { ServiceMap } = useContext(PainterContext);
  const service = ServiceMap.get(key);

  if (!service) {
    throw new Error(`未找到 ${String(key)} 服务`);
  }

  return service as T;
}

/** 获取画布钩子 */
export function usePainterHook<T extends HookType>(
  key: ServiceTypeWithKey<T>,
  sort?: 'asc' | 'desc',
) {
  const { HookMap } = useContext(PainterContext);
  const hooks = (HookMap.get(key) ?? []) as unknown as T[];

  if (hooks.length === 0) {
    return [];
  }

  if (sort) {
    return hooks.sort(createSorter(sort) as any);
  }

  return hooks;
}

/** 注册画布键盘事件 */
export function useHotkey(key: string, options: HotKeyOptions, callback: KeyHandler) {
  const painterRef = usePainterService(PAINTER_HTML_ELEMENT);
  const realOptions: HotKeyOptions = {
    keyup: false,
    keydown: false,
    capture: true,
    ...options,
  };

  useEffect(() => {
    if (painterRef.current) {
      // TODO: 需要优化，暂时使用 document 监听，因为只有激活元素才能有键盘事件
      HotKey(key, realOptions, callback);
    }

    return () => {
      HotKey.unbind(key, callback);
    };
  }, [key, callback, painterRef.current]);
}

/** 组合高阶渲染器 */
export function useComposeHOC<T extends object>(core: IRendererData<T>) {
  const hooks = usePainterHook<IRendererHOC<T>>(RENDERER_HOC, 'desc');
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
