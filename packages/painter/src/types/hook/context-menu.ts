import { ReactNode } from 'react';
import { createServiceKey } from '../../context';

/**
 * 右键菜单项钩子
 *
 * @description 该钩子将用于右键菜单项的实现
 * @example
 * ```ts
 * const painterContextMenuHooks = useHook(IPainterContextMenuHook);
 * ```
 */
export const IPainterContextMenuItemHook
  = createServiceKey<IPainterContextMenuItemHook>('IPainterContextMenuHook');

export interface IPainterContextMenuItemProps {
  /** 关闭菜单 */
  onHide?(): void;
}

export enum IPainterContextMenuItemCategory {
  /** 编辑 */
  Edit,
}

/**
 * 右键菜单项渲染器
 *
 * @description 如果当前所有菜单项都返回了`null`，则不显示右键菜单。
 */
export interface IPainterContextMenuItemHook {
  /**
   * 菜单项名称
   *
   * @description 需要有唯一性
   */
  name: string;
  /**
   * 菜单项系列
   *
   * @description 用于分类，不同的分类菜单项之间将会有个分割线
   */
  category: IPainterContextMenuItemCategory;
  /**
   * 菜单项排序
   *
   * @description 数字越小越在上面
   */
  order?: number;
  /**
   * 菜单项图标组件
   *
   * @description 菜单项事件、是否显示等情况，都在组件内自由控制。
   */
  Render(props: IPainterContextMenuItemProps): ReactNode;
}
