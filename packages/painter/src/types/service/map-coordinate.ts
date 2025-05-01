import type { Point } from '@circuit/math';
import type { Watcher } from '@xiao-ai/utils';

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
