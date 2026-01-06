import { PluginMetaInfos, ScopeMetaInfos, TestGlobalNamespace } from '@circuit/inject/core/context';
import { beforeAll, afterAll } from 'vitest';

/** 插件路径解析函数 */
export type ResolveRegisterFn = (file: string) => Promise<any>;

/** 清理注册信息 */
export function clearRegister() {
  PluginMetaInfos.clear();
  ScopeMetaInfos.clear();
}

/**
 * 创建插件注册函数
 *
 * @param resolveRegister 插件路径解析函数
 * @returns 插件注册函数
 */
export function createRegisterPlugin(resolveRegister: ResolveRegisterFn) {
  return function registerPlugin(
    file: string | string[],
    testConfig: Record<string, any> = {},
  ) {
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
      clearRegister();
      delete (globalThis as any)[TestGlobalNamespace];
    });
  };
}

