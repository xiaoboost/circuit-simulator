import { ReactNode } from 'react';
import { createServiceKey } from '../../context';

/**
 * 画布快捷操作钩子
 *
 * @description 该钩子将用于画布快捷操作的实现
 * @example
 * ```ts
 * const painterToolbarActionHooks = useHook(PAINTER_TOOLBAR_ACTION_HOOK);
 * ```
 */
export const PAINTER_TOOLBAR_ACTION_HOOK
  = createServiceKey<IPainterToolBarAction>('PainterToolBarAction');

/**
 * 画布快捷操作按钮渲染器
 *
 * @description 如果当前组件所有按钮都返回了`null`，表示当前组件没有提示框按钮，整个提示框都不会显示。
 */
export interface IPainterToolBarAction {
  /**
   * 按钮名称
   *
   * @description 需要有唯一性
   */
  name: string;
  /**
   * 按键排序
   *
   * @description 数字越小越在左边
   */
  order?: number;
  /**
   * 按钮图标组件
   *
   * @description 按钮事件、是否显示等情况，都在组件内自由控制。
   */
  Render(): ReactNode;
}
