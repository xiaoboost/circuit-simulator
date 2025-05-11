/** 能被排序的元素 */
interface SortedItem {
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
