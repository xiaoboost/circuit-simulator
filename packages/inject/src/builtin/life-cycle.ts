import { createServiceKey } from '../core';

/**
 * 生命周期钩子
 *
 * @description 该钩子将用于实现画布的生命周期
 * @example
 * ```ts
 * const lifeCycle = useHook(ILifeCycleHook);
 * ```
 */
export const ILifeCycleHook
  = createServiceKey<ILifeCycleHook>('ILifeCycleHook');

/**
 * 生命周期
 */
export interface ILifeCycleHook {
  /** 作用域初始化完成 */
  onCreated?(): void | Promise<void>;
  /** 作用域销毁前 */
  onDestroyed?(): void | Promise<void>;
}
