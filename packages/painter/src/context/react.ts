import { useEffect, useContext, useState } from 'react';
import { useUnmount } from 'react-use';
import { HookType, ServiceType } from '../types';
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

    // 加载完成
    setReady(true);
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
export function usePainterService<T>(key: ServiceTypeWithKey<T>) {
  const { ServiceMap } = useContext(PainterContext);
  const service = ServiceMap.get(key);

  if (!service) {
    throw new Error(`未找到 ${String(key)} 服务`);
  }

  return service as T;
}

/** 获取画布钩子 */
export function usePainterHook<T>(key: ServiceTypeWithKey<T>) {
  const { HookMap } = useContext(PainterContext);
  const hook = HookMap.get(key);

  if (!hook) {
    throw new Error(`未找到 ${String(key)} 钩子`);
  }

  return hook as unknown as T[];
}
