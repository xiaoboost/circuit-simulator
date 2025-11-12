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

/** 掉帧率计算结果 */
export interface DroppedRateResult {
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
   * 最大连续掉帧数
   *
   * @description 连续掉帧的最大帧数
   */
  maxConsecutiveFrames: number;
  /**
   * 最大连续掉帧时间
   *
   * @description 最大连续掉帧的累计时间
   * @description 单位：毫秒
   */
  maxConsecutiveTimeMs: number;
}

/** 动态采样结果 */
export interface DynamicResult {
  /**
   * 场景名称
   */
  name: string;
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
   * 最大连续掉帧数
   *
   * @description 连续掉帧的最大帧数
   */
  maxConsecutiveFrames: number;
  /**
   * 最大连续掉帧时间
   *
   * @description 最大连续掉帧的累计时间
   * @description 单位：毫秒
   */
  maxConsecutiveTimeMs: number;
}
