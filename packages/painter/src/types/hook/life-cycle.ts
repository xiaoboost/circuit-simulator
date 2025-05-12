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
   * 初始化之前
   *
   * @description 画布将会等待所有插件的此钩子运行完毕才加载
   */
  beforeInit?(): void | Promise<void>;
}
