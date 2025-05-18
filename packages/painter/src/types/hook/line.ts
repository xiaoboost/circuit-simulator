import { LineStructuredData } from '@circuit/electronics';
import { createServiceKey } from '../../context';
import { IRendererData } from './render';

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

/** 导线渲染器 */
export type ILineRenderer = IRendererData<ILineRendererProps>;
