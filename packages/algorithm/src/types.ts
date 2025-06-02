import { type Point } from './point';

/** 点位置 */
export type Position = [x: number, y: number];
/** 折线 */
export type Path = Position[];
/** 线段 */
export type Segment = [start: Position, end: Position];
/** 旋转矩阵 */
export type RotateMatrix = [Position, Position];
/** 点或者类似点 */
export type PointLike = number[] | Position | Point;
/** 点输入 */
export type PointInput = PointLike | number;
/** 方向文本 */
export type DirectionLabel = keyof typeof Direction;
/** 外框定义 */
export type MarginBox = [top: number, right: number, bottom: number, left: number];
/** 矩形 */
export interface BoundingBox {
  minX: number;
  minY: number;
  maxX: number;
  maxY: number;
}
/** 向量方向定义 */
export enum Direction {
  Center,
  Top,
  TopLeft,
  TopRight,
  Bottom,
  BottomLeft,
  BottomRight,
  Left,
  Right,
}
/** 旋转方向定义 */
export enum Rotate {
  /** 同向 */
  Same,
  /** 反向 */
  Reverse,
  /** 顺时针 */
  Clockwise,
  /** 逆时针 */
  AntiClockwise,
  /** X 轴对称 */
  XAxis,
  /** Y 轴对称 */
  YAxis,
}
