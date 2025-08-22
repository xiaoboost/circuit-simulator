import { useContext, useMemo } from 'react';
import { RootScope, InjectContext } from './context';
import { ServiceTypeWithKey } from './types';
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
  return {
    useService<T>(key: ServiceTypeWithKey<T>) {
      return getServiceWithScope(key, scope, useContext(InjectContext));
    },
    useHook<T>(key: ServiceTypeWithKey<T>, sort?: 'asc' | 'desc') {
      const context = useContext(InjectContext);
      return useMemo(() => {
        return getHookWithScope(key, scope, context, sort);
      }, [key, scope, sort, context]);
    },
  };
}

const GlobalUse = createReactHookWithScope(RootScope);

/** 全局作用域获取服务 */
export const useServiceWithGlobal = GlobalUse.useService;
/** 全局作用域获取钩子 */
export const useHookWithGlobal = GlobalUse.useHook;
