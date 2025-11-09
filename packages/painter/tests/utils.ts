import path from 'path';
import { PluginMetaInfos, ScopeMetaInfos, TestGlobalNamespace } from '@circuit/inject/core/context';
import { useInjectInstall } from '@circuit/inject/core/installer';
import { ServiceTypeWithKey } from '@circuit/inject/core/types';
import { renderHook, waitForStateBe } from '@circuit/test-toolkit';
import { beforeAll, afterAll } from 'vitest';
import { useService } from '../src/context';

export function resolveRegister(file: string) {
  return import(path.resolve(__dirname, '../src/plugins', file));
}

export function registerPlugin(file: string | string[], testConfig: Record<string, any> = {}) {
  beforeAll(async () => {
    if (Array.isArray(file)) {
      for (const f of file) {
        await resolveRegister(f);
      }
    }
    else {
      await resolveRegister(file);
    }
    (globalThis as any)[TestGlobalNamespace] = testConfig;
  });

  afterAll(async () => {
    await clearRegister();
    delete (globalThis as any)[TestGlobalNamespace];
  });
}

export async function getPlugin<T>(key: ServiceTypeWithKey<T>): Promise<T> {
  const originalError = console.error;
  console.error = (...args: any[]) => {
    if (!args[0].includes('was not wrapped in act')) {
      originalError(...args);
    }
  };
  const { result: { current: isInitialized } } = renderHook(() => useInjectInstall());
  await waitForStateBe(() => isInitialized[0], true);
  const { result: { current: service } } = renderHook(() => useService(key));
  console.error = originalError;
  return service;
}

export function clearRegister() {
  PluginMetaInfos.clear();
  ScopeMetaInfos.clear();
}
