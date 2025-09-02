import { Point, getDirectionByLabel } from '@circuit/algorithm';
import { getPartPrototype } from '@circuit/electronics';
import { PartStructuredData, TextBias } from '@circuit/types';

/** 当前位置距离器件最近的方向 */
export function getPartNearestDirection(data: PartStructuredData, position: Point) {
  const { rotate, kind } = data;
  const { textBias } = getPartPrototype(kind);
  const direction = (Object.keys(textBias ?? {}) as (keyof TextBias)[])
    .filter(Boolean)
    .map((key) => getDirectionByLabel(key).mul(textBias![key]!))
    .map((bias) => bias.rotate(rotate))
    .reduce(
      (pre, next) =>
        pre.distance(position) < next.distance(position) ? pre : next,
    );

  // 将方向转为旋转角度
  return direction.toDirection();
}
