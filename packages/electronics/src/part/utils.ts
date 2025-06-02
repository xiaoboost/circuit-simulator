import { RotateMatrix, Point, Position, MarginBox as Margin } from '@circuit/algorithm';
import { BoundingBox } from './types';

/**
 * 获取内边框顶点
 * @param position 位置
 * @param margin 边框
 * @param rotate 旋转
 * @returns 边框顶点：左上、右上、右下、左下
 */
export function getPaddingRect(
  position: Point | Position,
  margin: Margin,
  rotate: RotateMatrix,
): BoundingBox {
  const endPoint = [[-margin[3], -margin[0]], [margin[1], margin[2]]];
  const data = endPoint.map((point) => Point.prototype.rotate.call(point, rotate));
  const minX = Math.min(data[0][0], data[1][0]);
  const maxX = Math.max(data[0][0], data[1][0]);
  const minY = Math.min(data[0][1], data[1][1]);
  const maxY = Math.max(data[0][1], data[1][1]);

  return [
    Point.from([minX, minY]).trunc(20).add(position),
    Point.from([maxX, minY]).trunc(20).add(position),
    Point.from([maxX, maxY]).trunc(20).add(position),
    Point.from([minX, maxY]).trunc(20).add(position),
  ];
}
