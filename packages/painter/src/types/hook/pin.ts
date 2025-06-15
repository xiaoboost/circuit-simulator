import type { PointLike } from '@circuit/algorithm';
import { IRendererData } from '@circuit/inject';
import { createServiceKey } from '../../context';

/**
 * 器件渲染器
 *
 * @description 该钩子将用于单个引脚的渲染
 * @example
 * ```ts
 * const pinRendererHooks = useHook(PIN_RENDERER);
 * ```
 */
export const PIN_RENDERER = createServiceKey<IPinRenderer>('PinRenderer');

/** 引脚渲染器输入参数 */
export interface IPinRendererProps extends React.SVGProps<SVGCircleElement> {
  /**
   * 引脚编号
   *
   * @description 该编号是引脚的唯一编号，在画布内唯一
   */
  id: string;
  /**
   * 节点位置
   *
   * @description 这个位置是相对哪里的需要看 DOM 结构
   */
  position: PointLike;
  /**
   * 半径
   *
   * @description 优先级最高
   * @default `-1`
   */
  r?: number;
  /**
   * 悬停半径
   *
   * @description 悬停时半径，优先级次高
   * @default `5`
   */
  hoverR?: number;
  /**
   * 闲置半径
   *
   * @description 闲置时半径，优先级次高
   * @default `0`
   */
  normalR?: number;
  /**
   * 动画持续时间
   *
   * @description 动画持续时间，单位为毫秒
   * @default `200`
   */
  duration?: number;
  /** 点击事件 */
  onMouseDown?: (ev: React.MouseEvent) => any;
}

/** 引脚渲染器 */
export type IPinRenderer = IRendererData<IPinRendererProps>;
