import { createServiceKey, type Watcher } from '@circuit/inject';

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

/** 器件标签显示方式 */
export enum PartLabelVisibleKind {
  /** 全部显示 */
  Visible,
  /** 只显示编号 */
  OnlyId,
  /** 只显示参数 */
  OnlyParam,
  /** 不显示 */
  NotVisible,
}

export interface IConfigurationService {
  /** 器件标签显示方式 */
  readonly PartLabelVisibleKind: typeof PartLabelVisibleKind;
  /** 器件标签显示 */
  readonly partLabelVisible: Watcher<PartLabelVisibleKind>;
  /** 图纸移动模式 */
  readonly movePainterMode: Watcher<boolean>;
  /** 打开调试日志 */
  readonly openDebugLog: Watcher<boolean>;
  /** 打开路径搜索调试器 */
  readonly openPathSearcherDebugger: Watcher<boolean>;
  /**
   * 预览模式
   *
   * @description 此模式通常是在浏览样例，用户的修改不会被持久化，可以撤销和重做
   */
  readonly previewMode: Watcher<boolean>;
}
