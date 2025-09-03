import { IRendererData } from '@circuit/inject';
// import { LineCoverMark } from '@circuit/map';
import { createServiceKey } from '../../context';

/**
 * 节点渲染器
 *
 * @description 该钩子将用于单个节点的渲染
 * @example
 * ```ts
 * const pointRendererHooks = useHook(IPointRendererHook);
 * ```
 */
export const IPointRendererHook = createServiceKey<IPointRendererHook>('IPointRendererHook');

/** 节点渲染器输入参数 */
// eslint-disable-next-line @typescript-eslint/no-empty-object-type
export interface IPointRendererProps {
  /** 节点数据 */
  // data: LineCoverMark;
}

/** 器件渲染器 */
export type IPointRendererHook = IRendererData<IPointRendererProps>;
