/** 帧样本 */
export interface FrameSample {
  /**
   * 时间戳
   *
   * @description 单位：毫秒
   */
  t: number;
  /**
   * 帧时间
   *
   * @description 单位：毫秒
   */
  dt: number;
}

/** 分位数 */
export interface Percentiles {
  p50: number;
  p70: number;
  p90: number;
  p95: number;
}

/** 稳态基线统计 */
export interface BaselineStats {
  /**
   * 有效样本
   */
  samples: number[];
  /**
   * 推断的同步周期
   *
   * @description 单位：毫秒
   */
  syncPeriodMs: number;
}

/**  */

/** 动态采样结果 */
export interface DynamicResult {
  /**
   * 场景名称
   */
  scenario: string;
  /**
   * 持续时间
   *
   * @description 单位：毫秒
   */
  durationMs: number;
  /**
   * 总帧数
   */
  totalFrames: number;
  /**
   * 掉帧数
   */
  droppedFrames: number;
  /**
   * 掉帧率
   *
   * @description 0..1
   */
  droppedRate: number;
  /**
   * 同步周期（用于计算掉帧率）
   *
   * @description 单位：毫秒
   */
  syncPeriodMs: number;
}
