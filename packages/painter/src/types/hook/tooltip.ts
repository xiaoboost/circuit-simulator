import { ReactNode } from 'react';

/**
 * 组件提示框按钮
 *
 * @description 组件的浮动提示框按钮，可以对不同组件显示不同的按钮。
 * @description 如果当前组件所有按钮都返回了`null`，表示当前组件没有提示框按钮，整个提示框都不会显示。
 */
export interface ComponentTooltipAction {
  /** 钩子类别 */
  kind: 'ComponentTooltipAction';
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
