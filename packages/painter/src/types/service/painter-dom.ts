import { RefObject } from 'react';
import { createServiceKey } from '../../context';

/**
 * 图纸原始`DOM`服务
 *
 * @description 获取图纸原始`DOM`
 * @example
 * ```ts
 * const painterHTMLElement = useService(IPainterHTMLElement);
 * ```
 */
export const IPainterHTMLElement
  = createServiceKey<IPainterHTMLElement>('PainterHTMLElement');

export type IPainterHTMLElement = RefObject<HTMLDivElement | null>;
