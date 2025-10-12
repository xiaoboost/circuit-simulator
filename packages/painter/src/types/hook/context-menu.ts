import type { ReactNode } from 'react';
import { createServiceKey } from '../../context';
import type { IHoverService, ISelectService } from '../service';

/**
 * 右键菜单项钩子
 *
 * @description 该钩子将用于右键菜单项的实现
 * @example
 * ```ts
 * const painterContextMenuHooks = useHook(IPainterContextMenuHook);
 * ```
 */
export const IContextMenuItemHook
  = createServiceKey<IContextMenuItemHook>('IPainterContextMenuHook');

export interface IContextMenuItemProps {
  /**
   * 菜单项名称
   *
   * @description 等于钩子中注册的名称
   */
  name: string;
  /**
   * 关闭菜单
   */
  onHide(): void;
  /**
   * 鼠标进入菜单项
   */
  onMouseEnter?(): void;
  /**
   * 鼠标离开菜单项
   */
  onMouseLeave?(): void;
}

export enum IContextMenuItemCategory {
  /** 编辑 */
  Edit,
  /** 视觉 */
  Visual,
}

export interface IContextMenuItemVisibleProps {
  hover: IHoverService;
  select: ISelectService;
}

/**
 * 右键菜单项渲染器
 *
 * @description 如果当前所有菜单项都返回了`null`，则不显示右键菜单。
 */
export interface IContextMenuItemHook {
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
  category: IContextMenuItemCategory;
  /**
   * 菜单项排序
   *
   * @description 数字越小越在上面
   */
  order?: number;
  /**
   * 菜单项是否可见
   *
   * @description 用于控制菜单项的显示与隐藏
   */
  visible(props: IContextMenuItemVisibleProps): boolean;
  /**
   * 菜单项图标组件
   *
   * @description 菜单项事件、是否显示等情况，都在组件内自由控制。
   */
  Render(props: IContextMenuItemProps): ReactNode;
}
