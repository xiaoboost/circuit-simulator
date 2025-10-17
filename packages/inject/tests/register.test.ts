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

  describe('批量获取服务 getServices', () => {
    it('应该能够批量获取多个服务', async () => {
      const service1Key = createServiceKey('Service1');
      const service2Key = createServiceKey('Service2');
      const service3Key = createServiceKey('Service3');

      const service1 = { name: 'service1', value: 1 };
      const service2 = { name: 'service2', value: 2 };
      const service3 = { name: 'service3', value: 3 };

      let capturedServices: any = null;

      defineGlobalPlugin(({ registerService, getServices }) => {
        registerService(service1Key, service1);
        registerService(service2Key, service2);
        registerService(service3Key, service3);

        // 在插件安装时测试 getServices
        capturedServices = getServices({
          s1: service1Key,
          s2: service2Key,
          s3: service3Key,
        });
      });

      // 等待插件安装完成
      const { result: isInitialized } = renderHook(() => useInjectInstall());
      await waitForStateBe(() => isInitialized.current.isInitialized, true);

      expect(capturedServices).toBeDefined();
      // 现在需要通过 getter 访问服务
      expect(capturedServices.s1).toBe(service1);
      expect(capturedServices.s2).toBe(service2);
      expect(capturedServices.s3).toBe(service3);
    });

    it('应该能够获取部分服务（混合存在和不存在的服务）', async () => {
      const existingKey = createServiceKey('ExistingService');
      const nonExistingKey = createServiceKey('NonExistingService');

      const existingService = { name: 'existing', value: 100 };

      let capturedServices: any = null;

      defineGlobalPlugin(({ registerService, getServices }) => {
        registerService(existingKey, existingService);

        // 测试获取部分存在的服务
        capturedServices = getServices({
          existing: existingKey,
          nonExisting: nonExistingKey,
        });
      });

      const { result: isInitialized } = renderHook(() => useInjectInstall());
      await waitForStateBe(() => isInitialized.current.isInitialized, true);

      expect(capturedServices).toBeDefined();
      // 访问存在的服务应该成功
      expect(capturedServices.existing).toBe(existingService);
      // 访问不存在的服务应该抛出错误
      expect(() => capturedServices.nonExisting).toThrow();
    });

    it('应该能够获取空对象', async () => {
      let capturedServices: any = null;

      defineGlobalPlugin(({ getServices }) => {
        capturedServices = getServices({});
      });

      const { result: isInitialized } = renderHook(() => useInjectInstall());
      await waitForStateBe(() => isInitialized.current.isInitialized, true);

      expect(capturedServices).toBeDefined();
      expect(Object.keys(capturedServices)).toHaveLength(0);
    });

    it('应该在不同作用域中正确获取服务', async () => {
      const parentScope = createScopeSymbol('ParentScope', RootScope);
      const childScope = createScopeSymbol('ChildScope', parentScope);

      const parentKey = createServiceKey('ParentService');
      const childKey = createServiceKey('ChildService');
      const rootKey = createServiceKey('RootService');

      const parentService = { name: 'parent', value: 1 };
      const childService = { name: 'child', value: 2 };
      const rootService = { name: 'root', value: 3 };

      let parentCapturedServices: any = null;
      let childCapturedServices: any = null;

      // 在根作用域注册服务
      defineGlobalPlugin(({ registerService }) => {
        registerService(rootKey, rootService);
      });

      // 在父作用域注册服务并测试 getServices
      const defineParentPlugin = createPluginDefinitionWithScope(parentScope);
      defineParentPlugin(({ registerService, getServices }) => {
        registerService(parentKey, parentService);

        parentCapturedServices = getServices({
          parent: parentKey,
          root: rootKey,
        });
      });

      // 在子作用域注册服务并测试 getServices
      const defineChildPlugin = createPluginDefinitionWithScope(childScope);
      defineChildPlugin(({ registerService, getServices }) => {
        registerService(childKey, childService);

        childCapturedServices = getServices({
          child: childKey,
          parent: parentKey,
          root: rootKey,
        });
      });

      const { result: isInitialized } = renderHook(() => useInjectInstall());
      await waitForStateBe(() => isInitialized.current.isInitialized, true);

      // 验证父作用域获取的服务
      expect(parentCapturedServices).toBeDefined();
      expect(parentCapturedServices.parent).toBe(parentService);
      expect(parentCapturedServices.root).toBe(rootService);

      // 验证子作用域获取的服务（应该能获取到父作用域和根作用域的服务）
      expect(childCapturedServices).toBeDefined();
      expect(childCapturedServices.child).toBe(childService);
      expect(childCapturedServices.parent).toBe(parentService);
      expect(childCapturedServices.root).toBe(rootService);
    });

    it('应该保持类型安全', async () => {
      interface Service1Type {
        name: string;
        value: number;
      }

      interface Service2Type {
        id: string;
        enabled: boolean;
      }

      const service1Key = createServiceKey<Service1Type>('TypedService1');
      const service2Key = createServiceKey<Service2Type>('TypedService2');

      const service1: Service1Type = { name: 'test', value: 42 };
      const service2: Service2Type = { id: 'test-id', enabled: true };

      let capturedServices: any = null;

      defineGlobalPlugin(({ registerService, getServices }) => {
        registerService(service1Key, service1);
        registerService(service2Key, service2);

        capturedServices = getServices({
          s1: service1Key,
          s2: service2Key,
        });
      });

      const { result: isInitialized } = renderHook(() => useInjectInstall());
      await waitForStateBe(() => isInitialized.current.isInitialized, true);

      expect(capturedServices).toBeDefined();
      expect(capturedServices.s1).toEqual(service1);
      expect(capturedServices.s2).toEqual(service2);

      // 验证类型正确性
      expect(typeof capturedServices.s1.name).toBe('string');
      expect(typeof capturedServices.s1.value).toBe('number');
      expect(typeof capturedServices.s2.id).toBe('string');
      expect(typeof capturedServices.s2.enabled).toBe('boolean');
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

    it('子作用域仅返回当前作用域钩子（不包含父作用域）', async () => {
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
      expect(hooksInChild.length).toBe(1);
      expect(hooksInChild[0]).toBe(childHook);
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

    it('钩子可按降序获取（仅当前作用域）', async () => {
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
      expect(hooksDesc.length).toBe(2);
      expect(hooksDesc[0]).toBe(child2);
      expect(hooksDesc[1]).toBe(child1);
    });

    it('多级作用域继承与优先级（服务最近优先，钩子不合并）', async () => {
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
      expect(hooksFromGrand.length).toBe(0);
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

    it('生命周期 onCreated 以先序顺序调用', async () => {
      const Parent = createScopeSymbol('LCParent', RootScope);
      const Child = createScopeSymbol('LCChild', Parent);
      const order: string[] = [];
      defineGlobalPlugin(({ registerHook }) => {
        registerHook(ILifeCycleHook, {
          onCreated() {
            order.push('root');
          },
        });
      });
      const defParent = createPluginDefinitionWithScope(Parent);
      const defChild = createPluginDefinitionWithScope(Child);
      defParent(({ registerHook }) => {
        registerHook(ILifeCycleHook, {
          onCreated() {
            order.push('parent');
          },
        });
      });
      defChild(({ registerHook }) => {
        registerHook(ILifeCycleHook, {
          onCreated() {
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

  describe('生命周期钩子', () => {
    it('onDestroyed 钩子应该在插件卸载时被调用', async () => {
      const calls: string[] = [];

      defineGlobalPlugin(({ registerHook }) => {
        registerHook(ILifeCycleHook, {
          onDestroyed() {
            calls.push('onDestroyed');
          },
        });
      });

      const originalError = console.error;
      console.error = (...args: any[]) => {
        if (!args[0].includes('was not wrapped in act')) {
          originalError(...args);
        }
      };

      const { result: isInitialized, unmount } = renderHook(() => useInjectInstall());
      await waitForStateBe(() => isInitialized.current.isInitialized, true);

      expect(calls).toHaveLength(0);

      unmount();

      expect(calls).toStrictEqual(['onDestroyed']);
      console.error = originalError;
    });

    it('definePlugin 返回值应该作为 onDestroyed 钩子被调用', async () => {
      const calls: string[] = [];

      defineGlobalPlugin(({ registerService }) => {
        const key = createServiceKey('TestService');
        const service = { name: 'test' };
        registerService(key, service);

        return () => {
          calls.push('definePlugin return value');
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

      expect(calls).toHaveLength(0);

      unmount();

      expect(calls).toStrictEqual(['definePlugin return value']);
      console.error = originalError;
    });

    it('多个 onDestroyed 钩子应该按注册顺序被调用', async () => {
      const calls: string[] = [];

      defineGlobalPlugin(({ registerHook }) => {
        registerHook(ILifeCycleHook, {
          onDestroyed() {
            calls.push('hook1');
          },
        });
        registerHook(ILifeCycleHook, {
          onDestroyed() {
            calls.push('hook2');
          },
        });
      });

      defineGlobalPlugin(({ registerService }) => {
        const key = createServiceKey('TestService2');
        const service = { name: 'test2' };
        registerService(key, service);

        return () => {
          calls.push('definePlugin return');
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

      expect(calls).toHaveLength(0);

      unmount();

      expect(calls).toStrictEqual([
        'hook1', 'hook2', 'definePlugin return',
      ]);
      console.error = originalError;
    });

    it('不同作用域的 onDestroyed 钩子应该只调用全局作用域的', async () => {
      const calls: string[] = [];
      const childScope = createScopeSymbol('ChildScope', RootScope);
      const defineChildPlugin = createPluginDefinitionWithScope(childScope);

      // 全局作用域钩子
      defineGlobalPlugin(({ registerHook }) => {
        registerHook(ILifeCycleHook, {
          onDestroyed() {
            calls.push('global onDestroyed');
          },
        });
      });

      // 子作用域钩子
      defineChildPlugin(({ registerHook }) => {
        registerHook(ILifeCycleHook, {
          onDestroyed() {
            calls.push('child onDestroyed');
          },
        });
      });

      const originalError = console.error;
      console.error = (...args: any[]) => {
        if (!args[0].includes('was not wrapped in act')) {
          originalError(...args);
        }
      };

      const { result: isInitialized, unmount } = renderHook(() => useInjectInstall());
      await waitForStateBe(() => isInitialized.current.isInitialized, true);

      expect(calls).toHaveLength(0);

      unmount();

      // 只应该调用全局作用域的钩子
      expect(calls).toStrictEqual(['global onDestroyed']);
      console.error = originalError;
    });
  });
});
