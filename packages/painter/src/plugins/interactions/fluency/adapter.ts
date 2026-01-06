import type { Watcher } from '@circuit/reactive';

/** 动态采样事件回调 */
export type DynamicEventCallback = (name: string) => void;

/** 基于 Watcher 的事件源配置 */
export interface WatcherEventSource {
  /** 事件源类型 */
  type: 'watcher';
  /** 场景名称前缀 */
  name: string;
  /** 状态监听器 */
  watcher: () => Watcher<boolean> | Watcher<Set<string>>;
}

/** 事件源配置 */
export type EventSource = WatcherEventSource;

/** 动态采样事件适配器 */
export interface DynamicEventAdapter {
  /**
   * 启动适配器
   */
  initialize(): void;
  /**
   * 订阅开始事件
   *
   * @description 当任何事件源触发开始事件时调用回调
   * @returns 取消订阅的函数
   */
  onStart(callback: DynamicEventCallback): () => void;
  /**
   * 订阅结束事件
   *
   * @description 当任何事件源触发结束事件时调用回调
   * @returns 取消订阅的函数
   */
  onEnd(callback: DynamicEventCallback): () => void;
  /**
   * 销毁适配器
   *
   * @description 清理所有事件源的订阅
   */
  destroy(): void;
}

/**
 * 创建动态采样事件适配器
 *
 * @description 统一管理多个事件源，对外暴露统一的 start/end 事件接口
 * @param sources 事件源配置数组
 * @returns 动态采样事件适配器
 *
 * @example
 * ```ts
 * const adapter = createDynamicEventAdapter([
 *   {
 *     type: 'watcher',
 *     name: 'animation',
 *     watcher: viewportService.isAnimating,
 *   },
 * ]);
 *
 * adapter.onStart((name) => {
 *   console.log(`动态采样开始: ${name}`);
 * });
 * ```
 */
export function createDynamicEventAdapter(
  sources: EventSource[],
): DynamicEventAdapter {
  /** 开始事件回调集合 */
  const startCallbacks = new Set<DynamicEventCallback>();
  /** 结束事件回调集合 */
  const endCallbacks = new Set<DynamicEventCallback>();
  /** 所有事件源的取消订阅函数 */
  const unsubscribeFunctions: (() => void)[] = [];

  // ========== 事件源订阅管理 ==========
  /**
   * 触发开始事件
   */
  function triggerStart(name: string) {
    startCallbacks.forEach((callback) => callback(name));
  }

  /**
   * 触发结束事件
   */
  function triggerEnd(name: string) {
    endCallbacks.forEach((callback) => callback(name));
  }

  /**
   * 订阅 Watcher 事件源
   */
  function subscribeWatcherSource(source: WatcherEventSource) {
    const unsubscribe = source.watcher().observe((current, previous) => {
      // 处理 Watcher<boolean>
      if (typeof current === 'boolean' && typeof previous === 'boolean') {
        // 从 false -> true：开始
        if (previous === false && current === true) {
          triggerStart(source.name);
        }
        // 从 true -> false：结束
        else if (previous === true && current === false) {
          triggerEnd(source.name);
        }
      }
      // 处理 Watcher<Set<string>>
      else if (current instanceof Set && previous instanceof Set) {
        // 计算新增的场景（start）
        for (const item of current) {
          if (!previous.has(item)) {
            // 组合名称：name + 状态变更的 string
            triggerStart(`${source.name}:${item}`);
          }
        }
        // 计算移除的场景（end）
        for (const item of previous) {
          if (!current.has(item)) {
            // 组合名称：name + 状态变更的 string
            triggerEnd(`${source.name}:${item}`);
          }
        }
      }
      // 未来扩展：可以在这里添加其他类型的 Watcher 处理逻辑
      // 例如：Watcher<Array<string>>、Watcher<Map<string, boolean>> 等
    });

    unsubscribeFunctions.push(unsubscribe);
  }

  // ========== 公共接口 ==========
  return {
    initialize() {
      for (const source of sources) {
        subscribeWatcherSource(source);
      }
    },
    onStart(callback: DynamicEventCallback) {
      startCallbacks.add(callback);
      return () => {
        startCallbacks.delete(callback);
      };
    },
    onEnd(callback: DynamicEventCallback) {
      endCallbacks.add(callback);
      return () => {
        endCallbacks.delete(callback);
      };
    },
    destroy() {
      // 取消所有事件源的订阅
      unsubscribeFunctions.forEach((unsubscribe) => unsubscribe());
      unsubscribeFunctions.length = 0;

      // 清空回调集合
      startCallbacks.clear();
      endCallbacks.clear();
    },
  };
}
