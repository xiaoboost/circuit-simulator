import { type IRendererData, createServiceKey } from '@circuit/inject';
import type { PartStructuredData, ElectronicPrototype } from '@circuit/types';

/**
 * 器件渲染器
 *
 * @description 该钩子将用于单个器件的渲染
 * @example
 * ```ts
 * const partRendererHooks = useHook(IPartRendererHook);
 * ```
 */
export const IPartRendererHook = createServiceKey<IPartRendererHook>('IPartRendererHook');

/** 器件渲染器输入参数 */
export interface IPartRendererProps extends React.SVGProps<SVGElement> {
  /** 器件数据 */
  data: PartStructuredData;
  /** 器件原型 */
  prototype: ElectronicPrototype;
}

/** 器件渲染器 */
export type IPartRendererHook = IRendererData<IPartRendererProps>;
