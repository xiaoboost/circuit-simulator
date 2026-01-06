import { renderHook, waitForStateBe } from '@circuit/test-toolkit';
import { useInjectInstall } from '@circuit/inject/core/installer';
import { useHookWithScope, useLifeCycleWithScope } from '@circuit/inject/core/react';
import { ServiceTypeWithKey } from '@circuit/inject/core/types';

/**
 * 获取插件钩子
 *
 * @param key 钩子键
 * @param scope 作用域
 * @param sort 排序方式
 * @returns 钩子数组
 */
export async function getPluginHooks<T>(
  key: ServiceTypeWithKey<T>,
  scope: symbol,
  sort?: 'asc' | 'desc',
  waitForLifeCycle = false,
): Promise<T[]> {
  const originalError = console.error;
  console.error = (...args: any[]) => {
    if (!args[0].includes('was not wrapped in act')) {
      originalError(...args);
    }
  };

  try {
    const { result: { current: [isInitialized] } } = renderHook(() => useInjectInstall());
    await waitForStateBe(() => isInitialized, true);

    if (waitForLifeCycle) {
      const { result: { current: [isLifeCycleReady] } } = renderHook(
        () => useLifeCycleWithScope(scope),
      );
      await waitForStateBe(() => isLifeCycleReady, true);
    }

    const { result: { current: hooks } } = renderHook(() => useHookWithScope(key, scope, sort));
    return hooks;
  }
  finally {
    console.error = originalError;
  }
}

/**
 * 创建特定作用域的钩子获取函数
 *
 * @param scope 作用域
 * @returns 钩子获取函数
 */
export function createGetHooks(scope: symbol) {
  return async function getHooks<T>(
    key: ServiceTypeWithKey<T>,
    sort?: 'asc' | 'desc',
  ): Promise<T[]> {
    return getPluginHooks(key, scope, sort, false);
  };
}

/**
 * 创建特定作用域的钩子获取函数（等待生命周期完成）
 *
 * @param scope 作用域
 * @returns 钩子获取函数
 */
export function createGetHooksAfterMounted(scope: symbol) {
  return async function getHooksAfterMounted<T>(
    key: ServiceTypeWithKey<T>,
    sort?: 'asc' | 'desc',
  ): Promise<T[]> {
    return getPluginHooks(key, scope, sort, true);
  };
}

