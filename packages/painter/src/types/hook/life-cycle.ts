import { createServiceKey } from '../../context';

/**
 * 生命周期钩子
 *
 * @description 该钩子将用于实现画布的生命周期
 * @example
 * ```ts
 * const lifeCycle = usePainterHook(LIFE_CYCLE_HOOK);
 * ```
 */
export const LIFE_CYCLE_HOOK =
  createServiceKey<ILifeCycle>('LifeCycle');

/**
 * 生命周期
 */
export interface ILifeCycle {
  /**
   * 插件初始化之后
   *
   * @description 所有插件加载完成之后立即运行，画布此时还未启动
   */
  afterPluginInit?(): void | Promise<void>;
}
