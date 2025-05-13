import { createSorter } from '@circuit/shared';
import HotKey, { KeyHandler } from 'hotkeys-js';
import { useEffect, useContext, useState } from 'react';
import { useUnmount } from 'react-use';
import {
  HookType,
  ServiceType,
  HotKeyOptions,
  PAINTER_HTML_ELEMENT,
  LIFE_CYCLE_HOOK,
  ILifeCycle,
  LOGGER_SERVICE,
  ILoggerService,
} from '../types';
import { PainterContext, PluginInstallers } from './context';
import { IPainterContext, ServiceTypeWithKey } from './types';

/** 画布组件初始化 */
export function usePainterInit(context: IPainterContext) {
  const [isReady, setReady] = useState(false);

  // 加载插件
  useEffect(() => {
    PluginInstallers.forEach((installer) => {
      const uninstaller = installer({
        getService: (key) => context.ServiceMap.get(key) as any,
        getHook: (key) => context.HookMap.get(key) as any,
        registerService: (key, service) => context.ServiceMap.set(key, service as ServiceType),
        registerHook: (key, hook) => {
          let arrHook = context.HookMap.get(key);
          if (!arrHook) {
            arrHook = [];
            context.HookMap.set(key, arrHook);
          }
          arrHook.push(hook as HookType);
        },
      });

      if (uninstaller) {
        context.PluginUninstallers.push(uninstaller);
      }
    });

    const lifeCycleHooks = (context.HookMap.get(LIFE_CYCLE_HOOK) ?? []) as ILifeCycle[];

    // 执行初始化钩子
    Promise.all(lifeCycleHooks.map((i) => i.beforeInit?.()))
      .then(() => setReady(true))
      .then(() => {
        (context.ServiceMap.get(LOGGER_SERVICE)! as ILoggerService).info('Painter', '图纸加载完成');
      });
  }, []);

  return isReady;
}

/** 画布组件卸载 */
export function usePainterUnmount(context: IPainterContext) {
  useUnmount(() => {
    context.PluginUninstallers.forEach((cb) => cb());
    context.PluginUninstallers.length = 0;
    context.HookMap.clear();
    context.ServiceMap.clear();
  });
}

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
