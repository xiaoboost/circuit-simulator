import { createServiceKey } from '../../context';
import type { IMapCoordinateService } from '../../types';

/**
 * 图纸坐标服务键
 *
 * @description 该服务用于获取图纸坐标的转换和计算功能
 * @example
 * ```ts
 * const mapCoordinateService = usePainterService(MAP_COORDINATE_SERVICE);
 * ```
 */
export const MAP_COORDINATE_SERVICE =
  createServiceKey<IMapCoordinateService>('MapCoordinateService');
