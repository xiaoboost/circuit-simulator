import { IRendererData } from '@circuit/inject';
import { LineStructuredData } from '@circuit/types';
import { createServiceKey } from '../../context';

/**
 * 导线渲染器
 *
 * @description 该钩子将用于单个导线的渲染
 * @example
 * ```ts
 * const lineRendererHooks = useHook(LINE_RENDERER);
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
