import { renderHook, waitForStateBe } from '@circuit/test-toolkit';
import { describe, it, expect, afterEach } from 'vitest';
import { ILifeCycleHook } from '../src/builtin';
import { PluginMetaInfos, ScopeMetaInfos, RootScope } from '../src/core/context';
import { defineGlobalPlugin, createServiceKey, createPluginDefinitionWithScope } from '../src/core/define';
import { createScopeSymbol, useInjectInstall } from '../src/core/installer';
import { getPluginService, getPluginHooks } from './utils';

describe('DI 系统', () => {
  afterEach(() => {
    PluginMetaInfos.clear();
    ScopeMetaInfos.clear();
  });

  describe('基本注册服务', () => {
    it('应该能够注册服务', async () => {
      const key = createServiceKey('Test');
      const service = { name: 'test', value: 1 };
      defineGlobalPlugin(({ registerService }) => {
        registerService(key, service);
      });
      const serviceGet = await getPluginService(key, RootScope);
      expect(serviceGet).toBe(service);
    });
    it('未注册服务时应抛出错误', async () => {
      const key = createServiceKey('NotExistService');
      await expect(getPluginService(key, RootScope)).rejects.toThrow();
    });
  });

  describe('基本注册钩子', () => {
    it('应该能够注册钩子', async () => {
      const key = createServiceKey('Hook');
      const hookA = { name: 'A' };
      const hookB = { name: 'B' };
      defineGlobalPlugin(({ registerHook }) => {
        registerHook(key, hookA);
        registerHook(key, hookB);
      });
      const hooks = await getPluginHooks(key, RootScope);
      expect(hooks.length).toBe(2);
      expect(hooks[0]).toBe(hookA);
      expect(hooks[1]).toBe(hookB);
    });
    it('未注册钩子时应返回空数组', async () => {
      const key = createServiceKey('NotExistHook');
      const hooks = await getPluginHooks(key, RootScope);
      expect(hooks).toStrictEqual([]);
    });
  });

  describe('作用域注册与查找', () => {
    it('子作用域可以获取到父作用域注册的服务', async () => {
      const key = createServiceKey('Srv');
      const child = createScopeSymbol('Child', RootScope);
      const service = { id: 1 };
      defineGlobalPlugin(({ registerService }) => {
        registerService(key, service);
      });
      const fromChild = await getPluginService(key, child);
      expect(fromChild).toBe(service);
    });

    it('子作用域应聚合自身与父作用域钩子并按 order 升序', async () => {
      const key = createServiceKey('HookAgg');
      const child = createScopeSymbol('Child3', RootScope);
      const defineChildPlugin = createPluginDefinitionWithScope(child);

      const rootHook = { name: 'root', order: 2 } as any;
      const childHook = { name: 'child', order: 1 } as any;

      defineGlobalPlugin(({ registerHook }) => {
        registerHook(key, rootHook);
      });
      defineChildPlugin(({ registerHook }) => {
        registerHook(key, childHook);
      });

      const hooksInChild = await getPluginHooks(key, child);
      expect(hooksInChild.length).toBe(2);
      expect(hooksInChild[0]).toBe(childHook);
      expect(hooksInChild[1]).toBe(rootHook);
    });

    it('父作用域不应该获取到仅在子作用域注册的服务', async () => {
      const key = createServiceKey('OnlyChildSrv');
      const child = createScopeSymbol('Child2', RootScope);
      const service = { id: 2 };
      const defineChildPlugin = createPluginDefinitionWithScope(child);
      defineChildPlugin(({ registerService }) => {
        registerService(key, service);
      });
      await expect(getPluginService(key, RootScope)).rejects.toThrow();
    });

    it('子作用域可通过 parent() 在父作用域注册服务', async () => {
      const Parent = createScopeSymbol('ParentScope', RootScope);
      const Child = createScopeSymbol('ChildScope', Parent);
      const key = createServiceKey('RegisterInParent');
      const service = { who: 'parent' };
      const defineChildPlugin = createPluginDefinitionWithScope(Child);
      defineChildPlugin(({ parent }) => {
        parent()?.registerService(key, service);
      });
      await expect(getPluginService(key, RootScope)).rejects.toThrow();
      const fromParent = await getPluginService(key, Parent);
      const fromChild = await getPluginService(key, Child);
      expect(fromParent).toBe(service);
      expect(fromChild).toBe(service);
    });

    it('子作用域可通过 root() 在根作用域注册服务', async () => {
      const Parent = createScopeSymbol('ParentScope2', RootScope);
      const Child = createScopeSymbol('ChildScope2', Parent);
      const key = createServiceKey('RegisterInRoot');
      const service = { who: 'root' };
      const defineChildPlugin = createPluginDefinitionWithScope(Child);
      defineChildPlugin(({ root }) => {
        root().registerService(key, service);
      });
      const fromRoot = await getPluginService(key, RootScope);
      const fromParent = await getPluginService(key, Parent);
      const fromChild = await getPluginService(key, Child);
      expect(fromRoot).toBe(service);
      expect(fromParent).toBe(service);
      expect(fromChild).toBe(service);
    });

    it('同一作用域重复注册服务应被覆盖', async () => {
      const key = createServiceKey('OverrideSrv');
      const v1 = { v: 1 };
      const v2 = { v: 2 };
      defineGlobalPlugin(({ registerService }) => {
        registerService(key, v1);
        registerService(key, v2);
      });
      const got = await getPluginService(key, RootScope);
      expect(got).toBe(v2);
    });

    it('钩子可按降序获取', async () => {
      const key = createServiceKey('OrderHook');
      const child = createScopeSymbol('OrderChild', RootScope);
      const defineChild = createPluginDefinitionWithScope(child);
      const root0 = { id: 'root-0' } as any;
      const root3 = { id: 'root-3', order: 3 } as any;
      const child1 = { id: 'child-1', order: 1 } as any;
      const child2 = { id: 'child-2', order: 2 } as any;
      defineGlobalPlugin(({ registerHook }) => {
        registerHook(key, root0);
        registerHook(key, root3);
      });
      defineChild(({ registerHook }) => {
        registerHook(key, child1);
        registerHook(key, child2);
      });
      const hooksDesc = await getPluginHooks(key, child, 'desc');
      expect(hooksDesc.length).toBe(4);
      expect(hooksDesc[0]).toBe(root3);
      expect(hooksDesc[1]).toBe(child2);
      expect(hooksDesc[2]).toBe(child1);
      expect(hooksDesc[3]).toBe(root0);
    });

    it('多级作用域继承与优先级（服务最近优先，钩子合并）', async () => {
      const Parent = createScopeSymbol('MSParent', RootScope);
      const Child = createScopeSymbol('MSChild', Parent);
      const Grand = createScopeSymbol('MSGrand', Child);
      const srvKey = createServiceKey('MultiSrv');
      const hookKey = createServiceKey('MultiHook');
      const srvRoot = { from: 'root' };
      const hookRoot = { id: 'root', order: 3 } as any;
      defineGlobalPlugin(({ registerService, registerHook }) => {
        registerService(srvKey, srvRoot);
        registerHook(hookKey, hookRoot);
      });
      const defParent = createPluginDefinitionWithScope(Parent);
      const defChild = createPluginDefinitionWithScope(Child);
      const srvParent = { from: 'parent' };
      const hookParent = { id: 'parent', order: 2 } as any;
      const hookChild = { id: 'child', order: 1 } as any;
      defParent(({ registerService, registerHook }) => {
        registerService(srvKey, srvParent);
        registerHook(hookKey, hookParent);
      });
      defChild(({ registerHook }) => {
        registerHook(hookKey, hookChild);
      });
      const srvFromGrand = await getPluginService(srvKey, Grand);
      expect(srvFromGrand).toBe(srvParent);
      const hooksFromGrand = await getPluginHooks(hookKey, Grand);
      expect(hooksFromGrand.length).toBe(3);
      expect(hooksFromGrand[0]).toBe(hookChild);
      expect(hooksFromGrand[1]).toBe(hookParent);
      expect(hooksFromGrand[2]).toBe(hookRoot);
    });

    it('插件卸载时调用 uninstaller，并在重新挂载后重新注册', async () => {
      const key = createServiceKey('SrvWithUninstall');
      const calls: string[] = [];
      const instance = { ok: true };
      defineGlobalPlugin(({ registerService }) => {
        registerService(key, instance);
        return () => {
          calls.push('uninstall');
        };
      });
      const originalError = console.error;
      console.error = (...args: any[]) => {
        if (!args[0].includes('was not wrapped in act')) {
          originalError(...args);
        }
      };
      const { result: isInitialized, unmount } = renderHook(() => useInjectInstall());
      await waitForStateBe(() => isInitialized.current.isInitialized, true);
      const first = await getPluginService(key, RootScope);
      expect(first).toBe(instance);
      unmount();
      expect(calls).toStrictEqual(['uninstall']);
      const { result: isInitialized2 } = renderHook(() => useInjectInstall());
      await waitForStateBe(() => isInitialized2.current.isInitialized, true);
      const again = await getPluginService(key, RootScope);
      expect(again).toBe(instance);
      console.error = originalError;
    });

    it('生命周期 afterPluginInit 以先序顺序调用', async () => {
      const Parent = createScopeSymbol('LCParent', RootScope);
      const Child = createScopeSymbol('LCChild', Parent);
      const order: string[] = [];
      defineGlobalPlugin(({ registerHook }) => {
        registerHook(ILifeCycleHook, {
          afterPluginInit() {
            order.push('root');
          },
        });
      });
      const defParent = createPluginDefinitionWithScope(Parent);
      const defChild = createPluginDefinitionWithScope(Child);
      defParent(({ registerHook }) => {
        registerHook(ILifeCycleHook, {
          afterPluginInit() {
            order.push('parent');
          },
        });
      });
      defChild(({ registerHook }) => {
        registerHook(ILifeCycleHook, {
          afterPluginInit() {
            order.push('child');
          },
        });
      });
      const originalError = console.error;
      console.error = (...args: any[]) => {
        if (!args[0].includes('was not wrapped in act')) {
          originalError(...args);
        }
      };
      const { result: isInitialized } = renderHook(() => useInjectInstall());
      await waitForStateBe(() => isInitialized.current.isInitialized, true);
      expect(order).toStrictEqual([
        'root',
        'parent',
        'child',
      ]);
      console.error = originalError;
    });

    it('测试环境 getTestConfig 可读并影响安装逻辑', async () => {
      (globalThis as any).__TEST_CONFIG__ = { featureX: true };
      const key = createServiceKey('SrvFromTestCfg');
      const srv = { enabled: true };
      defineGlobalPlugin(({ getTestConfig, registerService }) => {
        const enabled = getTestConfig<boolean>('featureX');
        if (enabled) {
          registerService(key, srv);
        }
      });
      const got = await getPluginService(key, RootScope);
      expect(got).toBe(srv);
    });

    it('重复注册同一 installer 只生效一次', async () => {
      const key = createServiceKey('DupHook');
      const onceHook = { id: 'once' } as any;
      const installer = ({ registerHook }: any) => {
        registerHook(key, onceHook);
      };
      defineGlobalPlugin(installer);
      defineGlobalPlugin(installer);
      const hooks = await getPluginHooks(key, RootScope);
      expect(hooks.length).toBe(1);
      expect(hooks[0]).toBe(onceHook);
    });

    it('访问不存在的作用域应抛出错误', async () => {
      const key = createServiceKey('Any');
      const fakeScope = Symbol('NotExistScope');
      await expect(getPluginService(key, fakeScope)).rejects.toThrow();
      await expect(getPluginHooks(key, fakeScope)).rejects.toThrow();
    });
  });
});
