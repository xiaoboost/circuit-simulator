import { createSorter } from '@circuit/shared';
import { type IScopeContainer, type ServiceTypeWithKey, type IScopeManager } from './types';

export function getServiceWithScope<T>(
  key: ServiceTypeWithKey<T>,
  scope: symbol,
  ScopeManager: IScopeManager,
): T {
  let scopeContainer = ScopeManager.get(scope);

  if (!scopeContainer) {
    throw new Error(`未找到 ${String(scope)} 作用域`);
  }

  let service = scopeContainer.context.ServiceMap.get(key);

  // 逐级向上查找
  while (!service && scopeContainer.parent) {
    scopeContainer = scopeContainer.parent;
    service = scopeContainer.context.ServiceMap.get(key);
  }

  if (!service) {
    throw new Error(`未找到 ${String(key)} 服务`);
  }

  return service as T;
}

export function getHookWithScope<T>(
  key: ServiceTypeWithKey<T>,
  scope: symbol,
  ScopeManager: IScopeManager,
  sort: 'asc' | 'desc' = 'asc',
): T[] {
  const scopeContainer = ScopeManager.get(scope);

  if (!scopeContainer) {
    throw new Error(`未找到 ${String(scope)} 作用域`);
  }

  return (scopeContainer.context.HookMap.get(key) ?? []).sort(createSorter(sort));
}

/** 先序遍历作用域树 */
export function getScopeList(root: IScopeContainer) {
  const result: IScopeContainer[] = [];

  function traverse(node: IScopeContainer) {
    result.push(node);
    for (const child of node.children) {
      traverse(child);
    }
  }

  traverse(root);
  return result;
}
