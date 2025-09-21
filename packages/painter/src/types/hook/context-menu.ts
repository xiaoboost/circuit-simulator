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
export const IPainterContextMenuHook
  = createServiceKey<IPainterContextMenuHook>('IPainterContextMenuHook');

/**
 * 右键菜单项渲染器
 *
 * @description 如果当前所有菜单项都返回了`null`，则不显示右键菜单。
 */
export interface IPainterContextMenuHook {
  /**
   * 菜单项唯一标识
   *
   * @description 需要有唯一性
   */
  key: string;
  /**
   * 菜单项名称
   *
   * @description 用于显示的名称
   */
  name: string;
  /**
   * 快捷键
   *
   * @description 用于显示的快捷键
   */
  hotkey?: string;
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
  Render(): ReactNode;
}
