import { useContext, useEffect } from 'react';
import { LIFE_CYCLE_HOOK, ILifeCycle } from '../builtin';
import { PluginMetaInfos, InjectContext, RootScope } from './context';
import { IScopeContainer, IScopeManager } from './types';
import { getServiceWithScope, getHookWithScope, getScopeList } from './utils';

function createScopeData(symbol: symbol, parentContainer: IScopeContainer | null): IScopeContainer {
  return {
    scope: symbol,
    parent: parentContainer,
    children: [],
    context: {
      ServiceMap: new Map(),
      HookMap: new Map(),
      PluginUninstallers: [],
    },
  };
}

export function createScope(name: string, parentScope: symbol, manager: IScopeManager) {
  const parentContainer = manager.get(parentScope);

  if (!parentContainer) {
    throw new Error(`在创建作用域时未找到上级作用域：${String(parentScope)}`);
  }

  const symbol = Symbol(name);
  const data = createScopeData(symbol, parentContainer);

  parentContainer.children.push(data);
  data.parent = parentContainer;

  manager.set(symbol, data);
  return symbol;
}

export function useInjectInstall(ready?: () => void) {
  const manager = useContext(InjectContext);

  useEffect(() => {
    async function install() {
      // 创建根作用域
      manager.set(RootScope, createScopeData(RootScope, null));

      for (const { installer, scope } of PluginMetaInfos.values()) {
        const scopeContainer = manager.get(scope);

        if (!scopeContainer) {
          throw new Error(`在注册插件时未找到 ${String(scope)} 对应作用域`);
        }

        const { context } = scopeContainer;
        const uninstaller = installer({
          getService: (key) => getServiceWithScope(key, scope, manager),
          getHook: (key) => getHookWithScope(key, scope, manager),
          registerService: (key, service) => context.ServiceMap.set(key, service),
          registerHook: (key, hook) => {
            context.HookMap.set(key, [...(context.HookMap.get(key) ?? []), hook]);
          },
        });

        if (uninstaller) {
          context.PluginUninstallers.push(uninstaller);
        }
      }

      // 作用域列表
      const list = getScopeList(manager.get(RootScope)!);

      for (const { context: { HookMap } } of list) {
        const lifeCycleHooks = (HookMap.get(LIFE_CYCLE_HOOK) ?? []) as ILifeCycle[];
        await Promise.all(lifeCycleHooks.map((i) => i.afterPluginInit?.()));
      }
    }

    install().then(() => ready?.());

    // 卸载插件
    return () => {
      const list = getScopeList(manager.get(RootScope)!);
      list.forEach(({ context }) => {
        context.PluginUninstallers.forEach((cb) => cb());
        context.PluginUninstallers.length = 0;
        context.HookMap.clear();
        context.ServiceMap.clear();
      });
    };
  }, []);
}
