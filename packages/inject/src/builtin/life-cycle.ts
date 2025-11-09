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
 * 生命周期执行阶段
 *
 * @description 定义生命周期钩子的执行顺序，数字越小优先级越高
 * @description 超出定义范围的 order 值会被映射到 FINAL 阶段
 */
export enum LifeCycleStage {
  INITIAL = 0,
  CONFIG,
  MIDDLE,
  LATE,
  FINAL,
}

/**
 * 生命周期
 */
export interface ILifeCycleHook {
  /**
   * 生命周期顺序
   *
   * @description 顺序排列，数字越小优先级越高
   * @description 建议使用 LifeCycleStage 枚举值
   * @description 超出 LifeCycleStage 范围的 order 值会被映射到 FINAL 阶段
   * @default 0
   */
  order?: LifeCycleStage;
  /** 作用域组件挂载后 */
  onMounted?(): void | Promise<void>;
  /** 作用域组件卸载前 */
  onUnmounted?(): void | Promise<void>;
}
