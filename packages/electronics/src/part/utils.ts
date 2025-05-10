import { RotateMatrix, Point } from '@circuit/algorithm';
import { Margin, MarginVertex } from './types';

export function getMarginVertex(position: Point, margin: Margin, rotate: RotateMatrix): MarginVertex {
  const endPoint = [[-margin[3], -margin[0]], [margin[1], margin[2]]];
  const data = endPoint.map((point) => Point.prototype.rotate.call(point, rotate).mul(20));
  const minX = Math.min(data[0][0], data[1][0]);
  const maxX = Math.max(data[0][0], data[1][0]);
  const minY = Math.min(data[0][1], data[1][1]);
  const maxY = Math.max(data[0][1], data[1][1]);

  return [
    Point.from([minX, minY]).add(position),
    Point.from([maxX, minY]).add(position),
    Point.from([maxX, maxY]).add(position),
    Point.from([minX, maxY]).add(position),
  ];
}
