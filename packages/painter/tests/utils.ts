import path from 'path';
import { PluginMetaInfos, ScopeMetaInfos } from '@circuit/inject/core/context';
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
    (globalThis as any).__TEST_CONFIG__ = testConfig;
  });

  afterAll(async () => {
    await clearRegister();
    delete (globalThis as any).__TEST_CONFIG__;
  });
}

export async function getPlugin<T>(key: ServiceTypeWithKey<T>): Promise<T> {
  const originalError = console.error;
  console.error = (...args: any[]) => {
    if (!args[0].includes('was not wrapped in act')) {
      originalError(...args);
    }
  };
  const { result: isInitialized } = renderHook(() => useInjectInstall());
  await waitForStateBe(() => isInitialized.current.isInitialized, true);
  const { result: { current: service } } = renderHook(() => useService(key));
  console.error = originalError;
  return service;
}

export function getPluginWithHook<T>(file: string, key: ServiceTypeWithKey<T>): Promise<T> {
  return new Promise((resolve) => {
    beforeAll(() => {
      resolveRegister(file);
      getPlugin(key).then((service) => {
        resolve(service);
      });
    });

    afterAll(() => clearRegister());
  });
}

export function clearRegister() {
  PluginMetaInfos.clear();
  ScopeMetaInfos.clear();
}
