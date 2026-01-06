import { renderHook, waitForStateBe } from '@circuit/test-toolkit';
import { useInjectInstall } from '@circuit/inject/core/installer';
import { useServiceWithScope, useLifeCycleWithScope } from '@circuit/inject/core/react';
import { ServiceTypeWithKey } from '@circuit/inject/core/types';

/**
 * 获取插件服务
 *
 * @param key 服务键
 * @param scope 作用域
 * @returns 服务实例
 */
export async function getPluginService<T>(
  key: ServiceTypeWithKey<T>,
  scope: symbol,
  waitForLifeCycle = false,
): Promise<T> {
  const originalError = console.error;
  console.error = (...args: any[]) => {
    if (!args[0].includes('was not wrapped in act')) {
      originalError(...args);
    }
  };

  try {
    const { result: isInitialized } = renderHook(() => useInjectInstall());
    await waitForStateBe(() => isInitialized.current[0], true);

    if (waitForLifeCycle) {
      const { result: isLifeCycleReady } = renderHook(
        () => useLifeCycleWithScope(scope),
      );
      await waitForStateBe(() => isLifeCycleReady.current[0], true);
    }

    const { result: { current: service } } = renderHook(() => useServiceWithScope(key, scope));
    return service;
  }
  finally {
    console.error = originalError;
  }
}

/**
 * 创建特定作用域的服务获取函数
 *
 * @param scope 作用域
 * @returns 服务获取函数
 */
export function createGetService(scope: symbol) {
  return async function getService<T>(key: ServiceTypeWithKey<T>): Promise<T> {
    return getPluginService(key, scope, false);
  };
}

/**
 * 创建特定作用域的服务获取函数（等待生命周期完成）
 *
 * @param scope 作用域
 * @returns 服务获取函数
 */
export function createGetServiceAfterMounted(scope: symbol) {
  return async function getServiceAfterMounted<T>(key: ServiceTypeWithKey<T>): Promise<T> {
    return getPluginService(key, scope, true);
  };
}

