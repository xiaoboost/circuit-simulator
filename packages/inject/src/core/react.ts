import { useContext, useMemo, useState, useEffect } from 'react';
import { ILifeCycleHook, LifeCycleStage } from '../builtin/life-cycle';
import { RootScope, InjectContext } from './context';
import { type ServiceTypeWithKey } from './types';
import { getHookWithScope, getServiceWithScope } from './utils';

/** 获取服务 */
export function useServiceWithScope<T>(key: ServiceTypeWithKey<T>, scope: symbol) {
  return getServiceWithScope(key, scope, useContext(InjectContext));
}

/** 获取钩子 */
export function useHookWithScope<T>(
  key: ServiceTypeWithKey<T>,
  scope: symbol,
  sort?: 'asc' | 'desc',
) {
  return getHookWithScope(key, scope, useContext(InjectContext), sort);
}

/** 创建快捷钩子 */
export function createReactHookWithScope(scope: symbol) {
  const hook = {
    useService<T>(key: ServiceTypeWithKey<T>) {
      return getServiceWithScope(key, scope, useContext(InjectContext));
    },
    useHook<T>(key: ServiceTypeWithKey<T>, sort?: 'asc' | 'desc') {
      const context = useContext(InjectContext);
      return useMemo(() => {
        return getHookWithScope(key, scope, context, sort);
      }, [
        key, scope, sort, context,
      ]);
    },
    useLifeCycle() {
      const hooks = hook.useHook(ILifeCycleHook);
      const [isInitialized, setIsInitialized] = useState(false);
      const getOrder = (order?: number) => {
        if (!order) {
          return LifeCycleStage.INITIAL;
        }

        return order > LifeCycleStage.FINAL ? LifeCycleStage.FINAL : order;
      };
      const executeHooks = async (
        map: Map<number, ILifeCycleHook[]>,
        asc = true,
        isMounted = true,
      ) => {
        const orders = Array.from(map.keys()).sort((a, b) => asc ? a - b : b - a);
        for (const order of orders) {
          const group = map.get(order)!;
          const promises = group
            .map((hook) => (isMounted ? hook.onMounted?.() : hook.onUnmounted?.()))
            .filter((result): result is Promise<void> => result instanceof Promise);

          await Promise.all(promises);
        }
      };

      useEffect(() => {
        // 按 order 排序，超出 LifeCycleStage 范围的映射到 FINAL 阶段
        const sortedHooks = hooks.slice().sort((a, b) => {
          return getOrder(a.order) - getOrder(b.order);
        });

        // 按 order 分组，组内并发，组间顺序执行
        const groups = new Map<number, ILifeCycleHook[]>();
        for (const hook of sortedHooks) {
          const order = getOrder(hook.order);
          groups.set(order, [...(groups.get(order) ?? []), hook]);
        }

        // 按 order 顺序执行挂载钩子，组内并发
        executeHooks(groups, true, true)
          .then(() => setIsInitialized(true));

        // 卸载时按 order 逆序执行卸载钩子
        return () => {
          executeHooks(groups, false, false);
        };
      }, [hooks]);

      return [isInitialized] as const;
    },
  };

  return hook;
}

const GlobalUse = createReactHookWithScope(RootScope);

/** 全局作用域获取服务 */
export const useServiceWithGlobal = GlobalUse.useService;
/** 全局作用域获取钩子 */
export const useHookWithGlobal = GlobalUse.useHook;
/** 全局作用域获取运行生命周期钩子 */
export const useLifeCycleWithGlobal = GlobalUse.useLifeCycle;
