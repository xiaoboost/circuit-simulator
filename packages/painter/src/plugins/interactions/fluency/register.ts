import {
  ILifeCycleHook,
  ILoggerService,
} from '@circuit/shared';
import { definePlugin, Watcher } from '../../../context';
// import { createDynamicCollector } from './dynamic';
import { enableRaf, enableRic } from './constant';
import { createSteadyCollector } from './steady';
import type { BaselineStats } from './types';

const LoggerName = '流畅度监控';

definePlugin(({ registerHook, getServices }) => {
  /** 服务模块 */
  const services = getServices({
    logger: ILoggerService,
  });

  if (!enableRaf || !enableRic) {
    services.logger.warn(LoggerName, '浏览器版本过低，无法进行流畅度检查。');
    return;
  }

  // ========== 公共状态 ==========
  /** 是否处于活动状态 */
  const isActive = new Watcher(false);
  /** 当前稳态基线 */
  const baseline = new Watcher<BaselineStats>({
    samples: [],
    syncPeriodMs: 0,
  });

  // ========== 采样模块 ==========
  /** 稳态采样模块 */
  const steady = createSteadyCollector({
    baseline,
  });

  // /** 动态采样模块 */
  // const dynamic = createDynamicCollector(
  //   () => currentBaseline,
  //   (result) => {
  //     services.logger.info(
  //       LoggerName,
  //       `动态采样完成 [${result.scenario}]`,
  //       `持续时间: ${result.durationMs.toFixed(0)} ms`,
  //       `掉帧率: ${(result.droppedRate * 100).toFixed(1)}%`,
  //       `掉帧数: ${result.droppedFrames}/${result.totalFrames}`,
  //     );
  //   },
  // );

  // ========== 监听稳态采样结果 ==========
  baseline.observe(({ syncPeriodMs: sync }) => {
    services.logger.debug(
      LoggerName,
      '稳态采样完成',
      `标准帧时间: ${sync.toFixed(2)} ms`,
      `标准帧率: ${Math.round(1000 / sync)} FPS`,
    );
  });

  // ========== 页面可见性监听 ==========
  function handleVisibilityChange() {
    if (document.visibilityState === 'hidden') {
      steady.pause();
    }
    else if (document.visibilityState === 'visible') {
      steady.resume();
    }
  }

  // 注册画布生命周期
  registerHook(ILifeCycleHook, {
    onCreated() {
      document.addEventListener('visibilitychange', handleVisibilityChange);
      steady.start();
    },
  });

  // 卸载器
  return () => {
    steady.stop();
    // dynamic.stopAll();
    isActive.destroy();
    baseline.destroy();
    document.removeEventListener('visibilitychange', handleVisibilityChange);
  };
});
