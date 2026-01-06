import type { Point } from '@circuit/algorithm';
import { createServiceKey } from '@circuit/inject';
import type { Watcher } from '@circuit/reactive';
import type { RefObject } from 'react';

/** 右键菜单服务键 */
export const IContextMenuService
  = createServiceKey<IContextMenuService>('PainterContextMenuService');

/** 右键菜单服务 */
export interface IContextMenuService {
  /** 是否显示 */
  readonly visible: Watcher<boolean>;
  /** 显示位置 */
  readonly position: Watcher<Point>;
  /** 指定展开的下拉菜单 */
  readonly openDropdown: Watcher<string>;
  /** 额外浮层元素引用 */
  readonly floatingElRef: RefObject<HTMLDivElement | null>;

  /** 在指定位置打开 */
  openAt(point: Point): void;
  /** 关闭 */
  close(): void;
}
