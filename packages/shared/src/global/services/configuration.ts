import { createServiceKey } from '@circuit/inject';
import type { Watcher } from '@circuit/reactive';

/** 配置服务缓存数据 */
export interface ConfigurationWatcherItemCache {
  key: string;
  watcher: Watcher<any>;
  default: any;
}

/**
 * 配置服务
 *
 * @description 该服务用于获取配置
 * @example
 * ```ts
 * const configurationService = useService(CONFIGURATION_SERVICE);
 * ```
 */
export const CONFIGURATION_SERVICE =
  createServiceKey<IConfigurationService>('ConfigurationService');

export interface IConfigurationService {
  /** 图纸移动模式 */
  readonly movePainterMode: Watcher<boolean>;
  /** 打开调试日志 */
  readonly openDebugLog: Watcher<boolean>;
  /**
   * 预览模式
   *
   * @description 此模式通常是在浏览样例，用户的修改不会被持久化，可以撤销和重做
   */
  readonly previewMode: Watcher<boolean>;
}
