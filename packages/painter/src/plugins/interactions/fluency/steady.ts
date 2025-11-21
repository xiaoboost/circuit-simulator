import { Watcher } from '../../../context';
import { STEADY_INTERVAL_MS, STEADY_MAX_SAMPLES } from './constant';
import type { BaselineStats, FrameSample } from './types';
import { processSteadySamples } from './utils';

/** 稳态采样控制器接口 */
export interface SteadyCollector {
  start(): void;
  stop(): void;
  pause(): void;
  resume(): void;
}

/** 创建稳态采样控制器 */
export function createSteadyCollector(baseline: Watcher<BaselineStats>): SteadyCollector {
  // ========== 状态管理 ==========
  /** 稳态采样正在运行 */
  let isRunning = false;
  /** 稳态采样是否暂停 */
  let isPaused = false;

  // ========== 帧循环状态 ==========
  /** 稳态采样间隔定时器 ID */
  let steadyIntervalTimerId: number | null = null;
  /** 帧循环 ID */
  let rafId: number | null = null;
  /** 空闲回调 ID */
  let idleCallbackId: number | null = null;
  /** 最后一帧时间 */
  let lastFrameTime: number | null = null;
  /** 样本缓存 */
  let samples: FrameSample[] = [];

  // ========== 帧循环管理 ==========
  /**
   * 停止采样
   */
  function stopFrameLoop() {
    if (rafId !== null) {
      cancelAnimationFrame(rafId);
      rafId = null;
    }

    if (idleCallbackId !== null) {
      cancelIdleCallback(idleCallbackId);
      idleCallbackId = null;
    }

    if (steadyIntervalTimerId !== null) {
      window.clearTimeout(steadyIntervalTimerId);
      steadyIntervalTimerId = null;
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
      if (lastFrameTime === null) {
        lastFrameTime = currentTime;
        rafId = requestAnimationFrame(frameLoop);
        return;
      }

      // 收集帧样本
      samples.push({
        t: currentTime,
        dt: currentTime - lastFrameTime,
      });

      // 样本数达标，计算基线
      if (samples.length >= STEADY_MAX_SAMPLES) {
        // 处理样本并计算基线
        const baselineResult = processSteadySamples(samples);

        if (baselineResult) {
          baseline.setData(baselineResult);
        }

        // 清空样本
        samples.length = 0;
        // 等待间隔时间开始下一轮采样
        stopFrameLoop();
        waitIntervalAndStart();
        return;
      }

      lastFrameTime = currentTime;

      // 继续下一帧
      rafId = requestAnimationFrame(frameLoop);
    };

    lastFrameTime = performance.now();
    rafId = requestAnimationFrame(frameLoop);
  }

  /**
   * 等待空闲后开始下一轮采样
   */
  function waitIdleAndStart() {
    idleCallbackId = requestIdleCallback(startFrameLoop);
  }

  /**
   * 等待间隔后开始下一轮采样
   */
  function waitIntervalAndStart() {
    steadyIntervalTimerId = window.setTimeout(waitIdleAndStart, STEADY_INTERVAL_MS);
  }

  /**
   * 清空状态
   */
  function clearState() {
    isRunning = false;
    isPaused = false;
    samples = [];
    stopFrameLoop();
  }

  // ========== 公共接口 ==========
  return {
    start() {
      if (isRunning) {
        return;
      }

      clearState();
      isRunning = true;

      // 初始检查
      if (document.visibilityState === 'visible') {
        waitIdleAndStart();
      }
      // 初始页面在后台，则标记为暂停
      else {
        isPaused = true;
      }
    },
    stop() {
      if (!isRunning) {
        return;
      }

      clearState();
    },
    resume() {
      if (!isRunning || !isPaused) {
        return;
      }

      isPaused = false;

      // 有样本，表示是在采样中途，则继续采样
      if (samples.length > 0) {
        waitIdleAndStart();
      }
      // 没有样本，且有上次采样结果，则等待下次间隔
      else if (baseline.data.syncPeriodMs > 0) {
        waitIntervalAndStart();
      }
      // 没有样本，且没有上次采样结果，此时是初次采样，则立即开始采样
      else {
        waitIdleAndStart();
      }
    },
    pause() {
      if (!isRunning || isPaused) {
        return;
      }

      isPaused = true;
      stopFrameLoop();
    },
  };
}
