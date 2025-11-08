import { useContext, useEffect, useState } from 'react';
import { ILifeCycleHook } from '../builtin';
import { PluginMetaInfos, ScopeMetaInfos, InjectContext, RootScope, TestGlobalNamespace } from './context';
import type { IScopeContainer, IScopeManager, IPluginScopeRegister } from './types';
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
  const getRegister = (scope: symbol): IPluginScopeRegister => {
    const scopeContainer = manager.get(scope);

    if (!scopeContainer) {
      throw new Error(`在注册插件时未找到 ${String(scope)} 对应作用域`);
    }

    const { context } = scopeContainer;
    return {
      registerService: (key, service) => context.ServiceMap.set(key, service),
      registerHook: (key, hook) => {
        context.HookMap.set(key, [...(context.HookMap.get(key) ?? []), hook]);
      },
    };
  };

  for (const { installer, scope } of pluginMetaInfos.values()) {
    const scopeContainer = manager.get(scope);

    if (!scopeContainer) {
      throw new Error(`在注册插件时未找到 ${String(scope)} 对应作用域`);
    }

    const { context } = scopeContainer;
    const uninstaller = installer({
      getService: (key) => getServiceWithScope(key, scope, manager),
      getServices: (services) => {
        const result: Record<string, any> = {};

        for (const [key, serviceKey] of Object.entries(services)) {
          Object.defineProperty(result, key, {
            get: () => getServiceWithScope(serviceKey, scope, manager),
            enumerable: true,
            configurable: false,
          });
        }

        return result as any;
      },
      getHook: (key) => getHookWithScope(key, scope, manager),
      getTestConfig(key) {
        return process.env.NODE_ENV === 'test'
          ? (globalThis as any)?.[TestGlobalNamespace]?.[key]
          : undefined;
      },
      ...getRegister(scope),

      root() {
        return getRegister(RootScope);
      },
      parent() {
        return scopeContainer.parent ? getRegister(scopeContainer.parent.scope) : undefined;
      },
    });

    if (uninstaller) {
      // 将 definePlugin 的返回值注册为生命周期钩子
      const lifecycleHook: ILifeCycleHook = {
        onDestroyed: uninstaller,
      };
      context.HookMap.set(ILifeCycleHook, [
        ...(context.HookMap.get(ILifeCycleHook) ?? []),
        lifecycleHook,
      ]);
    }
  }
}

async function runPluginAfterInit(manager: IScopeManager) {
  const { context: { HookMap } } = manager.get(RootScope)!;
  const lifeCycleHooks = (HookMap.get(ILifeCycleHook) ?? []) as ILifeCycleHook[];
  await Promise.all(lifeCycleHooks.map((hook) => hook.onCreated?.()));
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
      const { context: { HookMap } } = manager.get(RootScope)!;
      const lifeCycleHooks = (HookMap.get(ILifeCycleHook) ?? []) as ILifeCycleHook[];

      // 运行销毁钩子
      lifeCycleHooks.map((hook) => hook.onDestroyed?.());
      // 重置初始化状态
      setIsInitialized(false);
    };
  }, []);

  return { isInitialized };
}
