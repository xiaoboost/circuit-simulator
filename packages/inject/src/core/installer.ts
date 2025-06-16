import { useContext, useEffect, useState } from 'react';
import { LIFE_CYCLE_HOOK, ILifeCycle } from '../builtin';
import { PluginMetaInfos, ScopeMetaInfos, InjectContext, RootScope } from './context';
import { IScopeContainer, IScopeManager } from './types';
import { getServiceWithScope, getHookWithScope, getScopeList } from './utils';

function createScopeData(
  symbol: symbol,
  parentContainer?: IScopeContainer | null,
): IScopeContainer {
  return {
    scope: symbol,
    parent: parentContainer ?? null,
    children: [],
    context: {
      ServiceMap: new Map(),
      HookMap: new Map(),
      PluginUninstallers: [],
    },
  };
}

function createScope(scopeMeta: typeof ScopeMetaInfos, manager: IScopeManager) {
  function createScopeRecursive(scope: symbol, parentScope: symbol | null = null) {
    // 创建当前作用域容器
    const parentContainer = parentScope ? manager.get(parentScope) : null;
    const scopeContainer = createScopeData(scope, parentContainer);

    if (parentContainer) {
      manager.set(scope, scopeContainer);
      scopeContainer.parent = parentContainer;
      parentContainer.children.push(scopeContainer);
    }
    else {
      manager.set(scope, createScopeData(scope));
    }

    // 处理子作用域
    const children = scopeMeta.get(scope);
    if (children) {
      for (const child of children) {
        createScopeRecursive(child, scope);
      }
    }
  }

  // 从根作用域开始创建
  createScopeRecursive(RootScope);
}

function installPlugin(pluginMetaInfos: typeof PluginMetaInfos, manager: IScopeManager) {
  for (const { installer, scope } of pluginMetaInfos.values()) {
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
}

async function runPluginAfterInit(manager: IScopeManager) {
  // 创建时用先序的顺序
  const list = getScopeList(manager.get(RootScope)!);

  for (const { context: { HookMap } } of list) {
    const lifeCycleHooks = (HookMap.get(LIFE_CYCLE_HOOK) ?? []) as ILifeCycle[];
    await Promise.all(lifeCycleHooks.map((i) => i.afterPluginInit?.()));
  }
}

export function createScopeSymbol(name: string, parentScope: symbol) {
  const symbol = Symbol(name);
  ScopeMetaInfos.set(parentScope, [...(ScopeMetaInfos.get(parentScope) ?? []), symbol]);
  return symbol;
}

export function useInjectInstall(ready?: () => void) {
  const manager = useContext(InjectContext);
  const [isInitialized, setIsInitialized] = useState(false);

  useEffect(() => {
    // 创建作用域
    createScope(ScopeMetaInfos, manager);
    // 创建插件
    installPlugin(PluginMetaInfos, manager);
    // 运行插件初始化钩子
    runPluginAfterInit(manager).then(() => {
      setIsInitialized(true);
      ready?.();
    });

    // 卸载插件
    return () => {
      // 卸载时用后序的顺序
      const list = getScopeList(manager.get(RootScope)!).reverse();
      list.forEach(({ context }) => {
        context.PluginUninstallers.forEach((cb) => cb());
        context.PluginUninstallers.length = 0;
        context.HookMap.clear();
        context.ServiceMap.clear();
      });
      setIsInitialized(false);
    };
  }, []);

  return { isInitialized };
}
