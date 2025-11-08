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
