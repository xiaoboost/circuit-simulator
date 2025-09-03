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
  /**
   * 插件初始化之后
   *
   * @description 所有插件加载完成之后运行
   */
  afterPluginInit?(): void | Promise<void>;
  /**
   * 画布初始化之后
   *
   * @description 画布初始化完成之后，但是 Loading 界面还没消失
   */
  afterPainterMounted?(): void | Promise<void>;
  /**
   * 画布卸载前
   */
  beforePainterUnmount?(): void | Promise<void>;
}
