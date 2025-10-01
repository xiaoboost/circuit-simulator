import { type IScopeContainer, type ServiceTypeWithKey, type IScopeManager } from './types';

/** 能被排序的元素 */
export interface SortedItem {
  /** 序号 */
  order?: number;
}

/**
 * 创建排序方法
 *
 * @param {'asc' | 'desc'} direction `'asc'`升序，`'desc'`降序
 */
export function createSorter<T extends SortedItem>(direction: 'asc' | 'desc' = 'asc') {
  return (pre: T, next: T) => {
    const a = pre.order ?? 0;
    const b = next.order ?? 0;
    return direction === 'asc' ? a - b : b - a;
  };
}

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
