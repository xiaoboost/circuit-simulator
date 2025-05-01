import { useEffect, useContext } from 'react';
import { useUnmount } from 'react-use';
import { PainterContext, PluginInstallers } from './context';
import { IPainterContext, ServiceTypeWithKey } from './types';

/** 画布组件初始化 */
export function usePainterInit(context: IPainterContext) {
  // 加载插件
  useEffect(() => {
    PluginInstallers.forEach((installer) => {
      const uninstaller = installer({
        getService: (key) => context.ServiceMap.get(key),
        registerService: (key, service) => context.ServiceMap.set(key, service),
        registerHook: (hook) => {
          const { kind } = hook;
          let arrHook = context.HookMap.get(kind);
          if (!arrHook) {
            arrHook = [];
            context.HookMap.set(kind, arrHook);
          }
          arrHook.push(hook);
        },
      });

      if (uninstaller) {
        context.PluginUninstallers.push(uninstaller);
      }
    });
  }, []);
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
