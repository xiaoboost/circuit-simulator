import { PartStructuredData, LineStructuredData } from '@circuit/electronics';
import type { ReactNode } from 'react';
import { createServiceKey } from '../../context';

/**
 * 视图层实现钩子
 *
 * @description 该钩子将用于视图图层的渲染
 * @description 视图层从 DOM 上来说是高于绘图层的，视图层不会随着画布变化而变化
 * @example
 * ```ts
 * const viewLayerHooks = usePainterHook(VIEW_LAYER_HOOK);
 * ```
 */
export const VIEW_LAYER_HOOK = createServiceKey<IViewLayer>('ViewLayer');

/**
 * 绘图层实现钩子
 *
 * @description 该钩子将用于绘图图层的渲染
 * @description 绘图层从 DOM 上来说是低于绘图层的，绘图层会随着画布变化而变化
 * @example
 * ```ts
 * const drawLayerHooks = usePainterHook(DRAW_LAYER_HOOK);
 * ```
 */
export const DRAW_LAYER_HOOK = createServiceKey<IDrawLayer>('DrawLayer');

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
export interface IViewLayer extends BaseLayer {
  /**
   * 渲染组件
   *
   * @description 视图层渲染组件将会覆盖当前视图区域，该组件不会随着画布变化而变化
   */
  Render(): ReactNode;
}

/** 画布图层渲染器输入参数 */
export interface IDrawLayerProps {
  /** 导线 */
  lines: readonly LineStructuredData[];
  /** 器件 */
  parts: readonly PartStructuredData[];
}

/** 画布绘图图层 */
export interface IDrawLayer extends BaseLayer {
  /**
   * 渲染组件
   *
   * @description 画布层渲染组件将会覆盖当前画布区域，该组件会随着画布变化而变化
   */
  Render(props: IDrawLayerProps): ReactNode;
}
