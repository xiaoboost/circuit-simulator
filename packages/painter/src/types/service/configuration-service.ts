import { createServiceKey, type Watcher } from '../../context';

/**
 * 图纸配置服务
 *
 * @description 该服务用于获取图纸配置
 * @example
 * ```ts
 * const configurationService = usePainterService(CONFIGURATION_SERVICE);
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
  /** 不显示 */
  NotVisible,
}

export interface IConfigurationService {
  /** 器件标签显示方式 */
  PartLabelVisibleKind: typeof PartLabelVisibleKind;
  /** 器件标签显示 */
  partLabelVisible: Watcher<PartLabelVisibleKind>;
  /** 图纸移动模式 */
  movePainterMode: Watcher<boolean>;
  /** 调试模式 */
  debuggerMode: Watcher<boolean>;
}
