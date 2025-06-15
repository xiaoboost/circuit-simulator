import type { Point } from '@circuit/algorithm';
import { createServiceKey, type Watcher } from '../../context';

/**
 * 图纸坐标服务键
 *
 * @description 该服务用于获取图纸坐标的转换和计算功能
 * @example
 * ```ts
 * const mapCoordinateService = useService(MAP_COORDINATE_SERVICE);
 * ```
 */
export const MAP_COORDINATE_SERVICE =
  createServiceKey<IMapCoordinateService>('MapCoordinateService');

export interface IMapCoordinate {
  /** 图纸位置 */
  position: Point;
  /** 图纸缩放比例 */
  scale: number;
}

export interface IMapCoordinateService {
  /** 图纸参数 */
  value: Watcher<IMapCoordinate>;
  /** 设置缩放比例 */
  setScale(scale: number): void;
  /** 设置图纸位置 */
  setPosition(position: Point): void;
}
