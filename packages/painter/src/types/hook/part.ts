import { PartStructuredData, ElectronicPrototype } from '@circuit/electronics';
import type { ReactNode } from 'react';
import { createServiceKey } from '../../context';

/**
 * 器件渲染器
 *
 * @description 该钩子将用于单个器件的渲染
 * @example
 * ```ts
 * const partRendererHooks = usePainterHook(PART_RENDERER);
 * ```
 */
export const PART_RENDERER = createServiceKey<IPartRenderer>('PartRenderer');

/** 器件渲染器输入参数 */
export interface IPartRendererProps {
  /** 器件数据 */
  data: PartStructuredData;
  /** 器件原型 */
  prototype: ElectronicPrototype;
}

/** 器件渲染器 */
export interface IPartRenderer {
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
   * @description 器件渲染器
   */
  Render(props: IPartRendererProps): ReactNode;
}
