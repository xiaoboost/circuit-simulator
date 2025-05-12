import { MarkMap } from '@circuit/map';
import { createServiceKey } from '../../context';

/**
 * 图纸服务键
 *
 * @description 图纸服务，该服务主要是提供图纸相关服务，比如元件连接关系等。
 * @example
 * ```ts
 * const mapService = usePainterService(MAP_SERVICE_KEY);
 * ```
 */
export const MAP_SERVICE_KEY =
  createServiceKey<IMapService>('Map');

export interface IMapService {
  /** 标记服务 */
  markService: MarkMap;
}
