import { useContext, useEffect, useState } from 'react';
import { ILifeCycleHook } from '../builtin';
import { PluginMetaInfos, ScopeMetaInfos, InjectContext, RootScope, TestGlobalNamespace } from './context';
import type { IScopeContainer, IScopeManager, IPluginScopeRegister } from './types';
import { getServiceWithScope, getHookWithScope } from './utils';

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

/**
 * 从调用栈中提取插件信息
 *
 * @param installer 插件安装器函数
 */
function extractPluginInstallerErrorInfo(installer: (...args: any[]) => any): string {
  // 尝试从函数名获取信息
  const installerName = installer.name || '匿名函数';

  try {
    // 创建错误来获取调用栈
    const error = new Error();
    Error.captureStackTrace?.(error, extractPluginInstallerErrorInfo);
    const lines = (error.stack ?? '').split('\n');

    let installPluginIndex = -1;

    // 查找 installPlugin 在堆栈中的位置
    for (let i = 0; i < lines.length; i++) {
      const line = lines[i];
      // 查找包含 installPlugin 的行
      if (line.includes('installPlugin') && (line.includes('at ') || line.includes('at Object.'))) {
        installPluginIndex = i;
        break;
      }
    }

    // 如果找到了 installPlugin，查找它的上一行（用户代码）
    if (installPluginIndex >= 1 && installPluginIndex - 1 < lines.length) {
      const userCodeLine = lines[installPluginIndex - 1];
      // 提取文件路径、行号和列号，格式：文件名:行号:列号（支持编辑器自动跳转）
      // 匹配格式：
      //   - at functionName (file:line:column)
      //   - at file:line:column
      //   - at functionName (file:line)
      //   - at file:line
      const stackPattern = /at\s+(?:\S+\s+)?\(?([^\s()]+):(\d+):(\d+)?\)?/;
      const stackMatch = userCodeLine.match(stackPattern);
      if (stackMatch) {
        const [
          ,
          filePath,
          line,
          column,
        ] = stackMatch;

        if (column) {
          return `错误语句: ${filePath}:${line}:${column}`;
        }
        else {
          return `错误语句: ${filePath}:${line}`;
        }
      }
    }
  }
  catch {
    // 如果提取失败，至少返回函数名
  }

  return `插件函数: ${installerName}`;
}

/**
 * 创建注册阶段访问错误消息
 *
 * @param type 访问类型：'服务' | '钩子'
 * @param key 服务/钩子键
 * @param installer 插件安装器函数
 * @param isGetServices 是否为 getServices 的延迟访问
 */
function createInstallPhaseError(
  type: '服务' | '钩子',
  key: symbol,
  installer: (...args: any[]) => any,
  isGetServices = false,
): Error {
  const action = isGetServices ? '访问' : '直接获取';
  const keyName = type === '服务' ? '服务键' : '钩子键';
  const pluginInfo = extractPluginInstallerErrorInfo(installer);

  const message = (
    `在插件注册阶段不允许${action}${type}。${keyName}: ${String(key)}。\n`
    + `${pluginInfo}\n`
    + '提示：在 definePlugin 的回调中，只能使用 registerService 和 registerHook 注册服务/钩子。\n'
    + `如果需要获取${type}，请在内部回调中使用 getService 或 getHook；以及使用 getServices 获取延迟查找的对象，然后在生命周期钩子（如 onMounted）中再访问其属性。`
  );

  return new Error(message);
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

    // 标记当前是否在插件安装阶段
    let isInstalling = true;

    const uninstaller = installer({
      getService: (key) => {
        if (isInstalling) {
          throw createInstallPhaseError('服务', key, installer);
        }
        return getServiceWithScope(key, scope, manager);
      },
      getServices: (services) => {
        const result: Record<string, any> = {};
        const cache: Record<string, any> = {};

        for (const [key, serviceKey] of Object.entries(services)) {
          Object.defineProperty(result, key, {
            get() {
              // 检查是否在安装阶段访问服务
              if (isInstalling) {
                throw createInstallPhaseError('服务', serviceKey, installer, true);
              }

              if (cache.hasOwnProperty(key)) {
                return cache[key];
              }

              const service = getServiceWithScope(serviceKey, scope, manager);
              cache[key] = service;
              return service;
            },
            enumerable: true,
            configurable: false,
          });
        }

        return result as any;
      },
      getHook: (key) => {
        if (isInstalling) {
          throw createInstallPhaseError('钩子', key, installer);
        }
        return getHookWithScope(key, scope, manager);
      },
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

    // 安装完成后，重置标志
    isInstalling = false;

    if (uninstaller) {
      // 将 definePlugin 的返回值注册为生命周期钩子
      const lifecycleHook: ILifeCycleHook = {
        onUnmounted: uninstaller,
      };
      context.HookMap.set(ILifeCycleHook, [
        ...(context.HookMap.get(ILifeCycleHook) ?? []),
        lifecycleHook,
      ]);
    }
  }
}

/** 创建作用域 */
export function createScopeSymbol(name: string, parentScope: symbol) {
  const symbol = Symbol(name);
  ScopeMetaInfos.set(parentScope, [...(ScopeMetaInfos.get(parentScope) ?? []), symbol]);
  return symbol;
}

/** DI 初始化钩子 */
export function useInjectInstall() {
  const manager = useContext(InjectContext);
  const [isInitialized, setIsInitialized] = useState(false);

  useEffect(() => {
    // 创建作用域
    createScope(ScopeMetaInfos, manager);
    // 创建插件
    installPlugin(PluginMetaInfos, manager);
    // 标记初始化完成
    setIsInitialized(true);

    // 卸载插件
    return () => {
      // 重置初始化状态
      setIsInitialized(false);
    };
  }, []);

  return [isInitialized] as const;
}
