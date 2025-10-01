import { Point } from '@circuit/algorithm';
import { createServiceKey, type Watcher } from '../../context';

/** 右键菜单服务键 */
export const IPainterContextMenuService
  = createServiceKey<IPainterContextMenuService>('PainterContextMenuService');

/** 右键菜单服务 */
export interface IPainterContextMenuService {
  /** 是否显示 */
  visible: Watcher<boolean>;
  /** 显示位置 */
  position: Watcher<Point>;
  /** 在指定位置打开 */
  openAt(point: Point): void;
  /** 关闭 */
  close(): void;
}
