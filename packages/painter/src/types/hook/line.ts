import { LineStructuredData } from '@circuit/electronics';
import type { ReactNode } from 'react';
import { createServiceKey } from '../../context';

/**
 * 导线渲染器
 *
 * @description 该钩子将用于单个导线的渲染
 * @example
 * ```ts
 * const lineRendererHooks = usePainterHook(LINE_RENDERER);
 * ```
 */
export const LINE_RENDERER = createServiceKey<ILineRenderer>('LineRenderer');

/** 画布图层渲染器输入参数 */
export interface ILineRendererProps {
  /** 导线数据 */
  data: LineStructuredData;
}

/** 器件渲染器 */
export interface ILineRenderer {
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
   * 渲染导线
   *
   * @description 器件渲染器
   */
  Render(props: ILineRendererProps): ReactNode;
}
