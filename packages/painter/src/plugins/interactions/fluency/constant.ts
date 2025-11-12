/**
 * 稳态采样间隔时长
 *
 * @description 每隔此时间进行一次稳态采样
 * @description 单位：毫秒
 */
export const STEADY_INTERVAL_MS = 30000;

/**
 * 稳态采样最大帧数
 *
 * @description 单位：帧
 */
export const STEADY_MAX_SAMPLES = 180;

/**
 * 异常帧剔除阈值
 *
 * @description 超过此阈值的帧将被视为异常帧（如 GC 导致的超长帧）并剔除。
 * @description 单位：毫秒
 */
export const GC_DISCARD_MS = 200;

/**
 * 分位数下界
 *
 * @description 用于裁剪样本区间，去除极端小值。
 * @description 单位：百分比
 */
export const PERCENTILE_LOW = 5;

/**
 * 分位数上界
 *
 * @description 用于裁剪样本区间，去除极端大值。
 * @description 单位：百分比
 */
export const PERCENTILE_HIGH = 95;

/**
 * 主峰占比下限
 *
 * @description 用于峰值检测，主峰占比必须超过此值才认为基线有效。
 */
export const MAIN_PEAK_MIN_SHARE = 0.8;

/**
 * KDE 带宽计算系数
 *
 * @description Silverman's rule 的系数，用于计算 KDE 带宽。
 * @description 值越大，带宽越大，峰值检测范围越宽。
 * @default 2.0
 */
export const KDE_BANDWIDTH_COEFFICIENT = 2.0;

/**
 * KDE 带宽最小值
 *
 * @description 带宽的最小值，防止在数据非常稳定时带宽过小导致峰值检测失败。
 * @description 单位：毫秒
 * @default 0.5
 */
export const KDE_BANDWIDTH_MIN_MS = 0.5;

/**
 * 连续掉帧告警阈值
 *
 * @description 连续掉帧数量超过此值时触发告警
 * @description 单位：帧
 */
export const WARN_DROPPED_FRAMES = 3;

/**
 * 掉帧判定阈值倍数
 *
 * @description 帧时间超过 syncPeriodMs * 此倍数才判定为掉帧。
 *
 * @remarks
 * 浏览器渲染原理：
 * - requestAnimationFrame 的回调会在浏览器准备渲染下一帧之前调用
 * - 如果回调执行时间过长，超过了当前帧的预算时间，浏览器会跳过这一帧
 * - 跳过的帧会在下一个 v-sync 周期（同步周期）渲染
 * - 因此，一旦掉帧，帧时间一定是同步周期的整数倍：
 *   - 正常帧：syncPeriod * 1
 *   - 掉一帧：syncPeriod * 2
 *   - 掉两帧：syncPeriod * 3
 *   - 以此类推
 *
 * 使用 1.5 倍作为阈值的原因：
 * - 正常帧的帧时间 ≈ syncPeriod（1 倍）
 * - 掉帧的帧时间 = syncPeriod * 2（2 倍）或更多
 * - 使用 1.5 倍可以准确区分正常帧（< 1.5 * syncPeriod）和掉帧（≥ 1.5 * syncPeriod）
 * - 这个倍数对所有刷新率都适用，无需针对不同刷新率调整
 *
 * @example
 * - 60Hz (16.67ms): 阈值 = 25.0ms，正常帧 < 25.0ms，掉帧 ≥ 33.3ms
 * - 120Hz (8.33ms): 阈值 = 12.5ms，正常帧 < 12.5ms，掉帧 ≥ 16.7ms
 * - 144Hz (6.94ms): 阈值 = 10.4ms，正常帧 < 10.4ms，掉帧 ≥ 13.9ms
 */
export const DROPPED_FRAME_THRESHOLD_MULTIPLIER = 1.5;

/**
 * 动态采样最小持续时间
 *
 * @description 低于此持续时间的动态过程不做动态检查，因为时间太短，没有统计意义。
 * @description 单位：毫秒
 */
export const DYNAMIC_MIN_DURATION_MS = 240;

/**
 * 明显卡顿的时间阈值
 *
 * @description 连续掉帧时间超过此值才认为是明显卡顿。
 * @description 单位：毫秒
 * @default 50
 *
 * @remarks
 * 人类对卡顿的感知阈值：
 * - < 16ms: 流畅（60Hz 一帧）
 * - 16-50ms: 轻微延迟，通常可接受
 * - 50-100ms: 可感知延迟
 * - > 100ms: 明显卡顿
 *
 * 使用 50ms 作为阈值的原因：
 * - 这是可感知延迟的临界点
 * - 对不同刷新率都适用（60Hz 掉3帧 ≈ 50ms，480Hz 掉24帧 ≈ 50ms）
 * - 与业界标准一致（Chrome DevTools 的 Long Task 阈值也是 50ms）
 */
export const CONSECUTIVE_DROP_NOTICEABLE_MS = 50;

/** 是否启用空闲回调 */
export const enableRic = (
  'requestIdleCallback' in window
  && typeof window.requestIdleCallback === 'function'
);

/** 空闲回调间隔 */
export const enableRaf = (
  'requestAnimationFrame' in window
  && typeof window.requestAnimationFrame === 'function'
);
