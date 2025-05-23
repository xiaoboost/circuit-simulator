import { useEffect, useState } from 'react';
import { PluginInstallers } from '../../../context/context';
import { IPainterContext } from '../../../context/types';
import {
  HookType,
  ServiceType,
  LIFE_CYCLE_HOOK,
  ILifeCycle,
} from '../../../types';

/** 画布组件初始化 */
export function usePainterInit(context: IPainterContext) {
  const [pluginReady, setPluginReady] = useState(false);

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
    Promise.all(lifeCycleHooks.map((i) => i.afterPluginInit?.()))
      .then(() => setPluginReady(true));
  }, []);

  return pluginReady;
}
