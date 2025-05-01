import type { ReactNode } from 'react';

interface BaseLayer {
  /**
   * 名称
   *
   * @description 图层唯一标识符
   */
  name: string;
  /**
   * 序号
   *
   * @description 顺序排列，数字越高 DOM 层级越高
   */
  order: number;
}

/** 画布视图图层 */
export interface ViewLayer extends BaseLayer {
  /** 钩子类别 */
  kind: 'ViewLayer';
  /**
   * 渲染组件
   *
   * @description 视图层渲染组件将会覆盖当前视图区域，该组件不会随着画布变化而变化
   */
  Render(): ReactNode;
}

/** 画布绘图图层 */
export interface DrawLayer extends BaseLayer {
  /** 钩子类别 */
  kind: 'DrawLayer';
  /**
   * 渲染组件
   *
   * @description 画布层渲染组件将会覆盖当前画布区域，该组件会随着画布变化而变化
   */
  Render(): ReactNode;
}
