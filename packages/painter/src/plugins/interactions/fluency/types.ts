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

/** 流畅度等级 */
export enum FluencyLevel {
  /** 流畅：< 16ms */
  SMOOTH = 'smooth',
  /** 轻微延迟：16-50ms */
  SLIGHT_DELAY = 'slight',
  /** 可感知延迟：50-100ms */
  NOTICEABLE_DELAY = 'noticeable',
  /** 明显卡顿：> 100ms */
  SEVERE_STUTTER = 'severe',
}

/** 流畅度等级统计 */
export interface FluencyLevelStats {
  /** 轻微延迟：帧数和持续时间 */
  slight: { frames: number; durationMs: number };
  /** 可感知延迟：帧数和持续时间 */
  noticeable: { frames: number; durationMs: number };
  /** 明显卡顿：帧数和持续时间 */
  severe: { frames: number; durationMs: number };
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
   * 开始时间戳
   *
   * @description 单位：毫秒
   */
  startTimestamp: number;
  /**
   * 结束时间戳
   *
   * @description 单位：毫秒
   */
  endTimestamp: number;
  /**
   * 持续时间
   *
   * @description 单位：毫秒
   */
  durationMs: number;
  /**
   * 同步周期
   *
   * @description 单位：毫秒
   */
  syncPeriodMs: number;
  /**
   * 设备帧率
   *
   * @description 单位：FPS
   */
  fps: number;
  /**
   * 期望帧数
   *
   * @description 基于持续时间和同步周期计算
   */
  expectedFrames: number;
  /**
   * 实际帧数
   */
  actualFrames: number;
  /**
   * 掉帧数
   */
  droppedFrames: number;
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
  /**
   * 流畅度等级统计
   *
   * @description 不包含流畅等级（流畅等级可通过总时间减去其他等级时间计算）
   */
  fluencyLevels: FluencyLevelStats;
}
