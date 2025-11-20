import { Watcher } from '../../../context';
import { DYNAMIC_MIN_DURATION_MS } from './constant';
import type { BaselineStats, DynamicResult, FrameSample } from './types';
import { calculateDroppedRate, calculateFluencyLevelStats } from './utils';

/** 动态采样控制器接口 */
export interface DynamicCollector {
  /** 场景名称 */
  readonly name: string;
  /** 停止采样并返回结果 */
  stop(): DynamicResult | null;
  /** 暂停采样 */
  pause(): void;
  /** 恢复采样 */
  resume(): void;
}

/** 创建动态采样控制器 */
export function createDynamicCollector(
  name: string,
  baseline: Watcher<BaselineStats>,
): DynamicCollector {
  // ========== 状态管理 ==========
  /** 是否暂停 */
  let isPaused = false;

  // ========== 帧循环状态 ==========
  /** 帧循环 ID */
  let rafId: number | null = null;
  /** 最后一帧时间 */
  let lastFrameTime: number | null = null;
  /** 开始时间 */
  let startTime: number | null = null;
  /** 暂停开始时间 */
  let pauseStartTime: number | null = null;
  /** 累计暂停时间 */
  let totalPausedTime = 0;
  /** 样本缓存 */
  const samples: FrameSample[] = [];

  // ========== 帧循环管理 ==========
  /**
   * 停止帧循环
   */
  function stopFrameLoop() {
    if (rafId !== null) {
      cancelAnimationFrame(rafId);
      rafId = null;
    }

    lastFrameTime = null;
  }

  /**
   * 开始帧采样
   */
  function startFrameLoop() {
    if (isPaused) {
      return;
    }

    const frameLoop = (currentTime: number) => {
      if (isPaused) {
        stopFrameLoop();
        return;
      }

      // 收集帧样本
      if (lastFrameTime !== null) {
        const dt = currentTime - lastFrameTime;

        samples.push({
          t: currentTime,
          dt,
        });
      }

      lastFrameTime = currentTime;
      rafId = requestAnimationFrame(frameLoop);
    };

    lastFrameTime = performance.now();
    rafId = requestAnimationFrame(frameLoop);
  }

  /**
   * 计算动态采样结果
   */
  function calculateResult(): DynamicResult | null {
    if (samples.length === 0 || startTime === null) {
      return null;
    }

    const endTime = performance.now();

    // 如果当前处于暂停状态，需要先计算最后一次暂停的时间
    let currentPausedTime = totalPausedTime;
    if (isPaused && pauseStartTime !== null) {
      currentPausedTime += endTime - pauseStartTime;
    }

    // 持续时间 = 总时间 - 累计暂停时间
    const durationMs = endTime - startTime - currentPausedTime;

    // 如果持续时间太短，不进行动态检查
    if (durationMs < DYNAMIC_MIN_DURATION_MS) {
      return null;
    }

    const syncPeriodMs = baseline.data.syncPeriodMs || 16.67; // 默认 60Hz
    const fps = Math.round(1000 / syncPeriodMs);
    const frameTimes = samples.map((s) => s.dt);
    const expectedFrames = Math.floor(durationMs / syncPeriodMs);
    const actualFrames = samples.length - 1;

    // 计算掉帧统计
    const droppedResult = calculateDroppedRate(frameTimes, syncPeriodMs);
    if (!droppedResult) {
      return null;
    }

    // 计算流畅度等级统计
    const fluencyLevels = calculateFluencyLevelStats(frameTimes);

    const result: DynamicResult = {
      name,
      startTimestamp: startTime,
      endTimestamp: endTime,
      durationMs,
      syncPeriodMs,
      fps,
      expectedFrames,
      actualFrames,
      droppedFrames: droppedResult.droppedFrames,
      maxConsecutiveFrames: droppedResult.maxConsecutiveFrames,
      maxConsecutiveTimeMs: droppedResult.maxConsecutiveTimeMs,
      fluencyLevels,
    };

    return result;
  }

  // ========== 初始化：创建后自动启动 ==========
  isPaused = false;
  startTime = performance.now();
  pauseStartTime = null;
  totalPausedTime = 0;
  samples.length = 0;

  // 如果页面可见，立即开始采样
  if (document.visibilityState === 'visible') {
    startFrameLoop();
  }
  // 如果页面隐藏，标记为暂停
  else {
    isPaused = true;
    pauseStartTime = performance.now();
  }

  // ========== 公共接口 ==========
  return {
    name,
    stop(): DynamicResult | null {
      // 停止帧循环
      stopFrameLoop();

      // 计算并返回结果
      const result = calculateResult();

      // 清空状态
      isPaused = false;
      samples.length = 0;
      startTime = null;
      pauseStartTime = null;
      totalPausedTime = 0;

      return result;
    },
    pause() {
      if (isPaused) {
        return;
      }

      isPaused = true;
      pauseStartTime = performance.now();
      stopFrameLoop();
    },
    resume() {
      if (!isPaused) {
        return;
      }

      // 计算本次暂停的时长并累加
      if (pauseStartTime !== null) {
        totalPausedTime += performance.now() - pauseStartTime;
        pauseStartTime = null;
      }

      isPaused = false;
      startFrameLoop();
    },
  };
}
