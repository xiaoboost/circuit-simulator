import { LineCoverMark } from '@circuit/map';
import type { ReactNode } from 'react';
import { createServiceKey } from '../../context';

/**
 * 节点渲染器
 *
 * @description 该钩子将用于单个节点的渲染
 * @example
 * ```ts
 * const pointRendererHooks = usePainterHook(POINT_RENDERER);
 * ```
 */
export const POINT_RENDERER = createServiceKey<IPointRenderer>('PointRenderer');

/** 节点渲染器输入参数 */
export interface IPointRendererProps {
  /** 节点数据 */
  data: LineCoverMark;
}

/** 器件渲染器 */
export interface IPointRenderer {
  /**
   * 名称
   *
   * @description 渲染器唯一标识符
   */
  name: string;
  /**
   * 序号
   *
   * @description 顺序排列，数字越高 DOM 层级越高
   */
  order: number;
  /**
   * 渲染组件
   *
   * @description 节点渲染器
   */
  Render(props: IPointRendererProps): ReactNode;
}
