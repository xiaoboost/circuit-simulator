import { ReactNode, CSSProperties } from 'react';
import { createServiceKey } from '../../context';

/**
 * 画布快捷操作钩子
 *
 * @description 该钩子将用于画布快捷操作的实现
 * @example
 * ```ts
 * const painterToolbarActionHooks = usePainterHook(PAINTER_TOOLBAR_ACTION_HOOK);
 * ```
 */
export const PAINTER_TOOLBAR_ACTION_HOOK =
  createServiceKey<IPainterToolBarAction>('PainterToolBarAction');

export interface IPainterToolBarActionProps {
  styles?: CSSProperties;
  className?: string;
}

export interface IPainterToolBarActionBase {
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
}

/**
 * 画布快捷操作按钮渲染器
 *
 * @description 传入`Renderer`函数，可以在其中任意自定义内容
 * @description 如果当前组件所有按钮都返回了`null`，表示当前组件没有提示框按钮，整个提示框都不会显示。
 */
export interface IPainterToolBarActionWithRenderer extends IPainterToolBarActionBase {
  /**
   * 按钮图标组件
   *
   * @description 按钮事件、是否显示等情况，都在组件内自由控制。
   */
  Render(props: IPainterToolBarActionProps): ReactNode;
}

/**
 * 画布快捷操作按钮组件
 *
 * @description 组件和回调分开的模式，这种模式主要用于点击事件需要外部控制的情况
 */
export interface IPainterToolBarActionWithIcon extends IPainterToolBarActionBase {
  /** 说明文本 */
  description?: string;
  /** 按钮组件 */
  icon: ReactNode;
  /** 点击事件 */
  handle(): void;
}

/**
 * 画布快捷操作按钮
 *
 * @description 画布的快捷操作按钮。
 * @description 如果当前组件所有按钮都返回了`null`，表示当前组件没有提示框按钮，整个提示框都不会显示。
 */
export type IPainterToolBarAction =
  | IPainterToolBarActionWithRenderer
  | IPainterToolBarActionWithIcon;
