import { Point } from './point';
import { Direction, Rotate, RotateMatrix } from './types';

/** 方向向量 */
export const DirectionVectorSet: Readonly<Record<Direction, Point>> = {
  [Direction.Center]: Point.from([0, 0]),
  [Direction.Top]: Point.from([0, -1]),
  [Direction.Bottom]: Point.from([0, 1]),
  [Direction.Left]: Point.from([-1, 0]),
  [Direction.Right]: Point.from([1, 0]),
  [Direction.TopLeft]: Point.from([-1, -1]),
  [Direction.TopRight]: Point.from([1, -1]),
  [Direction.BottomLeft]: Point.from([-1, 1]),
  [Direction.BottomRight]: Point.from([1, 1]),
};

/** 旋转矩阵 */
export const RotateMatrixSet: Readonly<Record<Rotate, RotateMatrix>> = {
  [Rotate.Same]: [[1, 0], [0, 1]],
  [Rotate.Reverse]: [[-1, 0], [0, -1]],
  [Rotate.Clockwise]: [[0, 1], [-1, 0]],
  [Rotate.AntiClockwise]: [[0, -1], [1, 0]],
  [Rotate.XAxis]: [[1, 0], [0, -1]],
  [Rotate.YAxis]: [[-1, 0], [0, 1]],
};
