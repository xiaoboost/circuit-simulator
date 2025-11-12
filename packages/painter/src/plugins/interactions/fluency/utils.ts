import {
  PERCENTILE_LOW,
  PERCENTILE_HIGH,
  GC_DISCARD_MS,
  MAIN_PEAK_MIN_SHARE,
  KDE_BANDWIDTH_COEFFICIENT,
  KDE_BANDWIDTH_MIN_MS,
  DROPPED_FRAME_THRESHOLD_MULTIPLIER,
} from './constant';
import type {
  BaselineStats,
  DroppedRateResult,
  FrameSample,
} from './types';

/**
 * 计算分位数
 */
export function calculatePercentiles(samples: number[], percentiles: number[]): number[] {
  const sorted = [...samples].sort((a, b) => a - b);
  return percentiles.map((p) => {
    const index = (sorted.length - 1) * (p / 100);
    const lower = Math.floor(index);
    const upper = Math.ceil(index);
    const weight = index - lower;

    if (lower === upper) {
      return sorted[lower] ?? 0;
    }

    return sorted[lower]! * (1 - weight) + sorted[upper]! * weight;
  });
}

/**
 * 裁剪样本到分位数区间
 */
export function clipSamplesByPercentiles(
  samples: number[],
  low: number,
  high: number,
): number[] {
  if (samples.length === 0) {
    return [];
  }

  const [lowValue, highValue] = calculatePercentiles(samples, [low, high]);

  return samples.filter((v) => v >= lowValue && v <= highValue);
}

/**
 * 推断同步周期
 *
 * @description 使用 KDE 算法进行峰值检测
 */
function inferSyncPeriod(samples: number[], minShare: number) {
  if (samples.length === 0) {
    return;
  }

  /**
   * 高斯核函数
   */
  function gaussianKernel(x: number): number {
    return Math.exp(-0.5 * x * x) / Math.sqrt(2 * Math.PI);
  }

  /**
   * 计算带宽
   *
   * @description 使用改进的 Silverman's rule，并设置最小值以保证峰值检测的稳定性
   */
  function calculateBandwidth(samples: number[]): number {
    const n = samples.length;

    if (n < 2) {
      return KDE_BANDWIDTH_MIN_MS;
    }

    // 计算标准差
    const mean = samples.reduce((sum, x) => sum + x, 0) / n;
    const variance = samples.reduce((sum, x) => sum + (x - mean) ** 2, 0) / n;
    const stdDev = Math.sqrt(variance);
    const bandwidth = KDE_BANDWIDTH_COEFFICIENT * stdDev * (n ** -0.2);

    // 设置最小值，防止在数据非常稳定时带宽过小
    return Math.max(bandwidth, KDE_BANDWIDTH_MIN_MS);
  }

  /**
   * 计算 KDE 密度值
   */
  function calculateKDE(
    x: number,
    samples: number[],
    bandwidth: number,
  ): number {
    let density = 0;

    for (const sample of samples) {
      const u = (x - sample) / bandwidth;
      density += gaussianKernel(u);
    }

    return density / (samples.length * bandwidth);
  }

  // 1. 计算带宽
  const bandwidth = calculateBandwidth(samples);

  if (bandwidth <= 0) {
    return;
  }

  // 2. 确定搜索范围
  const min = Math.min(...samples);
  const max = Math.max(...samples);
  const range = max - min;

  if (range <= 0) {
    return;
  }

  // 3. 在范围内采样多个点，计算 KDE 值
  // 采样点数：根据范围动态调整，确保精度
  const samplePoints = Math.max(100, Math.min(500, Math.ceil(range / 0.1)));
  const step = range / samplePoints;

  let maxDensity = 0;
  let maxDensityX = min;

  for (let i = 0; i <= samplePoints; i++) {
    const x = min + i * step;
    const density = calculateKDE(x, samples, bandwidth);

    if (density > maxDensity) {
      maxDensity = density;
      maxDensityX = x;
    }
  }

  // 4. 计算峰值占比（峰值附近的样本数 / 总样本数）
  const peakSamples = samples.filter(
    (s) => Math.abs(s - maxDensityX) <= bandwidth,
  );
  const share = peakSamples.length / samples.length;

  // 5. 检查是否满足最小占比要求
  if (share < minShare) {
    return;
  }

  return maxDensityX;
}

/**
 * 计算掉帧率
 *
 * @param samples 帧时间样本
 * @param syncPeriod 同步周期（ms）
 * @returns 掉帧率计算结果
 */
export function calculateDroppedRate(
  samples: number[],
  syncPeriod: number,
): DroppedRateResult | undefined {
  if (samples.length === 0) {
    return;
  }

  // 计算掉帧阈值：syncPeriod * 倍数
  const threshold = syncPeriod * DROPPED_FRAME_THRESHOLD_MULTIPLIER;
  const droppedFrames = samples.filter((dt) => dt > threshold);

  // 计算最大连续掉帧数和最大连续掉帧时间
  let maxConsecutiveCount = 0;
  let maxConsecutiveTime = 0;
  let currentConsecutiveCount = 0;
  let currentConsecutiveTime = 0;

  for (const dt of samples) {
    if (dt > threshold) {
      // 当前帧是掉帧
      currentConsecutiveCount++;
      currentConsecutiveTime += dt;
    }
    else {
      // 当前帧不是掉帧，更新最大值并重置计数
      if (currentConsecutiveCount > maxConsecutiveCount) {
        maxConsecutiveCount = currentConsecutiveCount;
        maxConsecutiveTime = currentConsecutiveTime;
      }
      currentConsecutiveCount = 0;
      currentConsecutiveTime = 0;
    }
  }

  // 处理末尾的连续掉帧
  if (currentConsecutiveCount > maxConsecutiveCount) {
    maxConsecutiveCount = currentConsecutiveCount;
    maxConsecutiveTime = currentConsecutiveTime;
  }

  return {
    droppedFrames: droppedFrames.length,
    droppedRate: droppedFrames.length / samples.length,
    maxConsecutiveFrames: maxConsecutiveCount,
    maxConsecutiveTimeMs: maxConsecutiveTime,
  };
}

/**
 * 处理稳态样本
 */
export function processSteadySamples(
  samples: FrameSample[],
) {
  if (samples.length === 0) {
    return;
  }

  // 1. 剔除异常帧（> gcDiscardMs）
  const validSamples = samples
    .filter((s) => s.dt <= GC_DISCARD_MS)
    .map((s) => s.dt);

  if (validSamples.length === 0) {
    return;
  }

  // 2. 裁剪到分位数区间（P5–P95）
  const clipped = clipSamplesByPercentiles(
    validSamples,
    PERCENTILE_LOW,
    PERCENTILE_HIGH,
  );

  if (clipped.length === 0) {
    return;
  }

  // 3. 推断同步周期（使用 KDE 算法）
  const peakResult = inferSyncPeriod(
    clipped,
    MAIN_PEAK_MIN_SHARE,
  );

  if (!peakResult) {
    return;
  }

  // 4. 返回结果
  const result: BaselineStats = {
    samples: clipped,
    syncPeriodMs: peakResult,
  };

  return result;
}
