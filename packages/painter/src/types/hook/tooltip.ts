import { ReactNode } from 'react';
import { createServiceKey } from '../../context';

/**
 * 元件快捷操作钩子
 *
 * @description 该钩子将用于元件快捷操作的实现
 * @example
 * ```ts
 * const tooltipActionHooks = useHook(COMPONENT_TOOLTIP_ACTION_HOOK);
 * ```
 */
export const COMPONENT_TOOLTIP_ACTION_HOOK
  = createServiceKey<IComponentTooltipAction>('ComponentTooltipAction');

/**
 * 组件提示框按钮
 *
 * @description 组件的浮动提示框按钮，可以对不同组件显示不同的按钮。
 * @description 如果当前组件所有按钮都返回了`null`，表示当前组件没有提示框按钮，整个提示框都不会显示。
 */
export interface IComponentTooltipAction {
  /**
   * 按钮名称
   *
   * @description 需要有唯一性
   */
  name: string;
  /**
   * 按钮图标组件
   *
   * @description 按钮事件、是否显示等情况，都在组件内自由控制。
   */
  render(): ReactNode;
}
