import { IRendererData } from '@circuit/inject';
import { LineStructuredData } from '@circuit/types';
import { createServiceKey } from '../../context';

/**
 * 导线渲染器
 *
 * @description 该钩子将用于单个导线的渲染
 * @example
 * ```ts
 * const lineRendererHooks = useHook(ILineRendererHook);
 * ```
 */
export const ILineRendererHook = createServiceKey<ILineRendererHook>('ILineRendererHook');

/** 画布图层渲染器输入参数 */
export interface ILineRendererProps extends React.SVGProps<SVGElement> {
  /** 导线数据 */
  data: LineStructuredData;
}

/** 导线渲染器 */
export type ILineRendererHook = IRendererData<ILineRendererProps>;
