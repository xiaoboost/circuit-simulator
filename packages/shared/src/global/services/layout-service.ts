import { createServiceKey } from '@circuit/inject';
import type { Watcher } from '@circuit/reactive';

/**
 * 布局服务
 *
 * @description 该服务用于获取布局信息
 * @example
 * ```ts
 * const layoutService = useService(LAYOUT_SERVICE);
 * ```
 */
export const LAYOUT_SERVICE
  = createServiceKey<ILayoutService>('LayoutService');

export interface ILayoutService {
  /** 左边栏活动标签页 */
  readonly leftSidebarActiveTab: Watcher<string>;
  /** 右侧边栏是否折叠 */
  readonly rightSidebarCollapsed: Watcher<boolean>;
}
