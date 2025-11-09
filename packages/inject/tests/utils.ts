import { renderHook, waitForStateBe } from '@circuit/test-toolkit';
import { useInjectInstall } from '../src/core/installer';
import { useServiceWithScope, useHookWithScope } from '../src/core/react';
import { ServiceTypeWithKey } from '../src/core/types';

export async function getPluginService<T>(key: ServiceTypeWithKey<T>, scope: symbol): Promise<T> {
  const originalError = console.error;
  console.error = (...args: any[]) => {
    if (!args[0].includes('was not wrapped in act')) {
      originalError(...args);
    }
  };
  const { result } = renderHook(() => useInjectInstall());
  const [isInitialized] = result.current;
  await waitForStateBe(() => isInitialized, true);
  const { result: { current: service } } = renderHook(() => useServiceWithScope(key, scope));
  console.error = originalError;
  return service;
}

export async function getPluginHooks<T>(
  key: ServiceTypeWithKey<T>,
  scope: symbol,
  sort?: 'asc' | 'desc',
): Promise<T[]> {
  const originalError = console.error;
  console.error = (...args: any[]) => {
    if (!args[0].includes('was not wrapped in act')) {
      originalError(...args);
    }
  };
  const { result } = renderHook(() => useInjectInstall());
  const [isInitialized] = result.current;
  await waitForStateBe(() => isInitialized, true);
  const { result: { current: hooks } } = renderHook(() => useHookWithScope(key, scope, sort));
  console.error = originalError;
  return hooks;
}
