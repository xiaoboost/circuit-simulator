/** 求键值 */
export function keys<T>(obj: T): (keyof T)[] {
  return Object.keys(obj as any) as (keyof T)[];
}
