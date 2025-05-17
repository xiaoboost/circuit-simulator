import { FC } from 'react';
import { createServiceKey } from '../../context';

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

/** 渲染器给高阶组件提供的编号参数 */
export interface IRendererWithHoc<T> {
  /** 获取编号 */
  getKey(props: T): string;
}

/** 参数附带当前渲染器编号 */
export type PropsWithRendererKey<T> = T & { $$key: string };

/** HOC 高阶组件 */
export type HOC<T> = (ChildRender: FC<T>) => FC<PropsWithRendererKey<T>>;

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
   * 渲染器
   *
   * @description 套在渲染器上的高阶渲染器
   */
  RenderHOC: HOC<any>;
}
