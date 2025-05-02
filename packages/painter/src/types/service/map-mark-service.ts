import { MarkMap } from '@circuit/map';
import { createServiceKey } from '../../context';

/**
 * 图纸标记服务键
 *
 * @description 图纸标记服务，该服务主要是提供图纸坐标稀疏哈希标记。
 * @example
 * ```ts
 * const mapMarkService = usePainterService(MAP_MARK_SERVICE_KEY);
 * ```
 */
export const MAP_MARK_SERVICE_KEY =
  createServiceKey<IMapMarkService>('MapMark');

export type IMapMarkService = MarkMap;
