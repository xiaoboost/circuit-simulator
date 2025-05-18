import { FC, PropsWithChildren as PC } from 'react';
import { createServiceKey } from '../../context';
import { IRendererData } from './render';

/**
 * 高阶组件渲染器
 *
 * @description 该钩子用于绘图时的各种临时状态渲染。
 * 它通常情况下会直接返回子节点，但是在临时状态成立时，会通过修改`Props`或者给子节点添加`DOM`元素以达成对节点的临时渲染。
 * @example
 * ```ts
 * const rendererHOCs = usePainterHook(RENDERER_HOC);
 * ```
 */
export const RENDERER_HOC =
  createServiceKey<IRendererHOC>('RendererHOC');

/** 高阶渲染器参数 */
export type PropsWithHocParams<T = object> = T & PC<{ $$key: string }>;

/** 高阶渲染器 */
export interface IRendererHOC {
  /**
   * 名称
   *
   * @description 渲染器唯一标识符
   */
  name: string;
  /**
   * 序号
   *
   * @description 数字越小，层级越浅
   */
  order?: number;
  /**
   * 是否启用
   *
   * @description 如果返回`false`，则不在此渲染器上实现
   * @default `() => true`
   */
  use?(hook: IRendererData<any>): boolean;
  /**
   * 渲染器
   *
   * @description 套在渲染器上的高阶渲染器
   */
  Render: FC<PropsWithHocParams<any>>;
}
