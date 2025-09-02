import { createServiceKey, type Watcher } from '../../context';

/**
 * 配置服务
 *
 * @description 该服务用于获取画布配置
 * @example
 * ```ts
 * const configurationService = useService(CONFIGURATION_SERVICE);
 * ```
 */
export const PAINTER_CONFIGURATION_SERVICE
  = createServiceKey<IPainterConfigurationService>('PainterConfigurationService');

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

export interface IPainterConfigurationService {
  /** 器件标签显示方式 */
  readonly PartLabelVisibleKind: typeof PartLabelVisibleKind;
  /** 图纸移动模式 */
  readonly movePainterMode: Watcher<boolean>;
  /** 器件标签显示 */
  readonly partLabelVisible: Watcher<PartLabelVisibleKind>;
  /** 打开图纸哈希调试器 */
  readonly openMapMarkDebugger: Watcher<boolean>;
  /** 打开导线搜索调试器 */
  readonly openLineSearchDebugger: Watcher<boolean>;
  /** 显示元件外边框 */
  readonly visibleElectronicOutline: Watcher<boolean>;
}
