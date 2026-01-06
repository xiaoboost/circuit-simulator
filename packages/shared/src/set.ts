/** 只读集合 */
export interface ReadonlySet<T> {
  /**
   * 集合大小
   */
  readonly size: number;
  /**
   * 按照加入的顺序迭代集合元素
   */
  forEach(callbackfn: (value: T, value2: T, set: ReadonlySet<T>) => void, thisArg?: any): void;
  /**
   * 集合是否包含某个元素
   */
  has(value: T): boolean;
}

export function isSameSet<T>(set1: Set<T>, set2: Set<T>) {
  if (set1.size !== set2.size) {
    return false;
  }

  for (const key1 of set1) {
    if (!set2.has(key1)) {
      return false;
    }
  }

  return true;
}
