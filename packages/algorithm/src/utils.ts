import { DirectionVectorSet } from './constant';
import { Point } from './point';
import { Direction, DirectionLabel, PointLike } from './types';

/** 判断两个点是否相等 */
export function isEqualPoint(point1: PointLike, point2: PointLike): boolean {
  return Point.prototype.isEqual.call(point1, point2);
}

/** 根据方向标签获取方向向量 */
export function getDirectionByLabel(label: DirectionLabel) {
  return DirectionVectorSet[Direction[label]];
}

/** 根据方向标签获取方向向量 */
export function getLabelByDirection(direction: Point): DirectionLabel | undefined {
  return (
    Object
      .keys(Direction)
      .find((key) => {
        return direction.isEqual(DirectionVectorSet[Direction[key as DirectionLabel]]);
      }) as DirectionLabel
  );
}
