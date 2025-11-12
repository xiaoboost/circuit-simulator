import {
  ILifeCycleHook,
  ILoggerService,
} from '@circuit/shared';
import { definePlugin, Watcher } from '../../../context';
import { IDragSceneService, IViewportService } from '../../../types';
import { createDynamicEventAdapter } from './adapter';
import { CONSECUTIVE_DROP_NOTICEABLE_MS, enableRaf, enableRic } from './constant';
import { createDynamicCollector, type DynamicCollector } from './dynamic';
import { createSteadyCollector } from './steady';
import type { BaselineStats } from './types';

const LoggerName = '流畅度监控';

definePlugin(({ registerHook, getServices }) => {
  /** 服务模块 */
  const services = getServices({
    logger: ILoggerService,
    drag: IDragSceneService,
    viewport: IViewportService,
  });

  // ========== 状态管理 ==========
  /** 当前动态采样控制器映射 */
  const dynamicCollectors = new Map<string, DynamicCollector>();
  /** 当前稳态基线 */
  const baseline = new Watcher<BaselineStats>({
    samples: [],
    syncPeriodMs: 0,
  });
  /** 稳态采样模块 */
  const steady = createSteadyCollector(baseline);

  // 监听稳态采样结果
  baseline.observe(({ syncPeriodMs: sync }) => {
    services.logger.debug(
      LoggerName,
      '稳态采样完成',
      `标准帧时间: ${sync.toFixed(2)} ms`,
      `标准帧率: ${Math.round(1000 / sync)} FPS`,
    );
  });

  // ========== 动态采样与稳态采样协调 ==========
  /**
   * 检查是否需要暂停稳态采样
   *
   * @description 稳态采样暂停的条件：
   * - 有动态采样正在进行，或
   * - 页面隐藏
   */
  function shouldPauseSteady(): boolean {
    return dynamicCollectors.size > 0 || document.visibilityState === 'hidden';
  }

  /**
   * 检查是否需要恢复稳态采样
   *
   * @description 稳态采样恢复的条件：
   * - 没有动态采样，且
   * - 页面可见
   */
  function shouldResumeSteady(): boolean {
    return dynamicCollectors.size === 0 && document.visibilityState === 'visible';
  }

  /**
   * 更新稳态采样状态
   */
  function updateSteadyState() {
    if (shouldPauseSteady()) {
      steady.pause();
    }
    else if (shouldResumeSteady()) {
      steady.resume();
    }
  }

  // ========== 动态采样事件适配器 ==========
  /** 动态采样事件适配器 */
  const eventAdapter = createDynamicEventAdapter([
    // 拖动事件源
    {
      type: 'watcher',
      name: 'drag',
      watcher: () => services.drag.scenes,
    },
    // 动画事件源
    {
      type: 'watcher',
      name: 'animation',
      watcher: () => services.viewport.isAnimating,
    },
  ]);

  // ========== 动态采样事件处理 ==========
  /** 动态采样开始回调 */
  function handleDynamicStart(name: string) {
    // 检查基线是否已计算
    if (baseline.data.syncPeriodMs === 0) {
      services.logger.debug(
        LoggerName,
        `动态采样跳过 [${name}]`,
        '稳态基线尚未计算完成',
      );
      return;
    }

    // 创建动态采样控制器
    const collector = createDynamicCollector(name, baseline);
    dynamicCollectors.set(name, collector);

    // 更新稳态采样状态
    updateSteadyState();
    services.logger.debug(LoggerName, `动态采样开始 [${name}]`);
  }

  /** 动态采样结束回调 */
  function handleDynamicEnd(name: string) {
    const collector = dynamicCollectors.get(name);

    if (!collector) {
      return;
    }

    // 停止动态采样并获取结果
    const result = collector.stop();
    dynamicCollectors.delete(name);

    // 更新稳态采样状态
    updateSteadyState();

    // 记录结果
    if (result) {
      // 判断是否明显卡顿（以时间为主）
      const isNoticeable = result.maxConsecutiveTimeMs >= CONSECUTIVE_DROP_NOTICEABLE_MS;
      const stutterMark = isNoticeable ? ' ⚠️ 明显卡顿' : '';

      services.logger.info(
        LoggerName,
        `动态采样完成 [${result.name}]`,
        `持续时间: ${result.durationMs.toFixed(0)} ms`,
        `掉帧: ${result.droppedFrames} 帧`,
        `(最大连续时间: ${result.maxConsecutiveTimeMs.toFixed(1)} ms,`,
        `最大连续帧数: ${result.maxConsecutiveFrames} 帧)${stutterMark}`,
        `掉帧率: ${(result.droppedRate * 100).toFixed(1)}%`,
      );
    }
    else {
      services.logger.debug(
        LoggerName,
        `动态采样跳过 [${name}]`,
        '持续时间过短，无统计意义',
      );
    }
  }

  // ========== 页面可见性监听 ==========
  function handleVisibilityChange() {
    if (document.visibilityState === 'hidden') {
      services.logger.debug(LoggerName, '页面切换至后台，流畅度采样暂停');

      // 暂停稳态采样
      updateSteadyState();

      // 暂停所有动态采样
      dynamicCollectors.forEach((collector) => {
        collector.pause();
      });
    }
    else if (document.visibilityState === 'visible') {
      services.logger.debug(LoggerName, '页面开始活动，流畅度采样重启');

      // 恢复稳态采样
      updateSteadyState();

      // 恢复所有动态采样
      dynamicCollectors.forEach((collector) => {
        collector.resume();
      });
    }
  }

  // ========== 生命周期管理 ==========
  registerHook(ILifeCycleHook, {
    onMounted() {
      const { logger } = services;

      if (!enableRaf || !enableRic) {
        logger.warn(LoggerName, '浏览器版本过低，无法进行流畅度检查。');
        return;
      }

      // 启动事件适配器
      eventAdapter.initialize();

      // 订阅动态采样事件
      eventAdapter.onStart(handleDynamicStart);
      eventAdapter.onEnd(handleDynamicEnd);

      // 订阅页面可见性变化
      document.addEventListener('visibilitychange', handleVisibilityChange);

      // 启动稳态采样
      steady.start();
    },
  });

  // ========== 卸载器 ==========
  return () => {
    // 销毁事件适配器
    eventAdapter.destroy();

    // 停止所有采样
    steady.stop();
    dynamicCollectors.forEach((collector) => collector.stop());
    dynamicCollectors.clear();

    // 清理资源
    baseline.destroy();
    document.removeEventListener('visibilitychange', handleVisibilityChange);
  };
});
