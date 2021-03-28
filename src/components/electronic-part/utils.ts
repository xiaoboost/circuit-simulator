import { useState, useEffect } from 'react';

import { Matrix, Point, toDirection } from 'src/math';
import { Part, Electronics } from 'src/electronics';

interface PartPoint {
  /** 节点半径 */
  size: number;
  /** 节点样式名称 */
  className: string;
  /** 原本节点相对器件原点位置 */
  origin: Point;
  /** 现在节点相对器件原点位置 */
  position: Point;
  /** 节点向外的延申方向 */
  direction: Point;
}

const defaultRotate = new Matrix(2, 'E');

export function useInvRotate(ma: Matrix) {
  const [invRotate, setInvRotate] = useState<Matrix>(defaultRotate);

  useEffect(() => {
    setInvRotate(ma.inverse());
  }, [ma]);

  return invRotate;
}

export function usePoints(part: Part) {
  const prototype = Electronics[part.kind];
  const [points, setPoints] = useState<PartPoint[]>([]);

  useEffect(() => {
    setPoints(prototype.points.map((point) => {
      return {
        size: -1,
        className: '',
        origin: Point.from(point.position),
        position: Point.prototype.rotate.call(point.position, part.rotate),
        direction: Point.prototype.rotate.call(toDirection(point.direction), part.rotate),
      };
    }));
  }, [part.rotate, part.connects]);

  return points;
}
