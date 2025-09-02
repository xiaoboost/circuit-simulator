import { useEffect, useState, useCallback, useMemo } from 'react';
import { Watcher, ReadonlyWatcher } from './watcher';

// 通用钩子类型
type UseWatcherHook<T> = T extends Watcher<infer U>
  ? [U, (value: U) => void]
  : T extends ReadonlyWatcher<infer U>
    ? [U]
    : never;

/** 数组操作接口 */
export interface ArrayActions<T> {
  push: (...items: T[]) => void;
  pop: () => void;
  shift: () => void;
  unshift: (...items: T[]) => void;
  splice: (start: number, deleteCount?: number, ...items: T[]) => void;
  remove: (index: number) => void;
  update: (index: number, item: T) => void;
  clear: () => void;
  map: (mapper: (item: T, index: number) => T) => void;
  filter: (predicate: (item: T, index: number) => boolean) => void;
  sort: (compareFn?: (a: T, b: T) => number) => void;
}

/** 对象操作接口 */
export interface ObjectActions<T extends object> {
  set: (key: keyof T, value: T[keyof T]) => void;
  setAll: (obj: Partial<T>) => void;
  remove: (key: keyof T) => void;
  clear: () => void;
  merge: (obj: Partial<T>) => void;
}

export function useWatcher<T extends Watcher<any> | ReadonlyWatcher<any>>(
  source: T,
): UseWatcherHook<T> {
  // 使用 state 触发组件重新渲染
  const [value, setValue] = useState(source.data);

  // 处理 Watcher 的更新方法
  const setter = useCallback((newValue: T extends Watcher<infer U> ? U : never) => {
    if (source instanceof Watcher) {
      source.setData(newValue);
    }
    else {
      console.warn('只读监听器无法主动设置值');
    }
  }, [source]);

  useEffect(() => {
    return source.observe(setValue);
  }, [source]);

  // 根据输入类型返回不同的元组
  return (source instanceof Watcher
    ? [value, setter]
    : [value]) as UseWatcherHook<T>;
}

export function useArrayWatcher<T>(watcher: Watcher<T[]>): [T[], ArrayActions<T>] {
  const [array] = useWatcher(watcher);
  const actions = useMemo<ArrayActions<T>>(() => {
    const update = (updater: (current: T[]) => T[]) => {
      watcher.setData(updater(watcher.data));
    };

    return {
      push: (...items) => update((current) => [...current, ...items]),
      pop: () => update((current) => current.slice(0, -1)),
      shift: () => update((current) => current.slice(1)),
      unshift: (...items) => update((current) => [...items, ...current]),
      splice: (start, deleteCount = 0, ...items) =>
        update((current) => {
          const newArray = [...current];
          newArray.splice(start, deleteCount, ...items);
          return newArray;
        }),
      remove: (index) => update((current) => current.filter((_, i) => i !== index)),
      update: (index, item) => update((current) => {
        if (index < 0 || index >= current.length) {
          return current;
        }
        const newArray = [...current];
        newArray[index] = item;
        return newArray;
      }),
      clear: () => update(() => []),
      map: (mapper) => update((current) => current.map(mapper)),
      filter: (predicate) => update((current) => current.filter(predicate)),
      sort: (compareFn) => update((current) => [...current].sort(compareFn)),
    };
  }, [watcher]);

  return [array, actions];
}

export function useObjectWatcher<T extends object>(watcher: Watcher<T>): [T, ObjectActions<T>] {
  const [object] = useWatcher(watcher);
  const actions = useMemo<ObjectActions<T>>(() => ({
    set: (key, value) => {
      watcher.setData({ ...watcher.data, [key]: value });
    },
    setAll: (obj) => {
      watcher.setData({ ...watcher.data, ...obj });
    },
    remove: (key) => {
      const { [key]: _, ...rest } = watcher.data;
      watcher.setData(rest as T);
    },
    clear: () => {
      watcher.setData({} as T);
    },
    merge: (obj) => {
      watcher.setData({ ...watcher.data, ...obj });
    },
  }), [watcher]);

  return [object, actions];
}
