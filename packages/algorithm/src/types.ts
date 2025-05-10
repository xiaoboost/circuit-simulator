import { type Point } from './point';

/** 折线 */
export type Line = [number, number][];
/** 线段 */
export type Segment = [[number, number], [number, number]];
/** 旋转矩阵 */
export type RotateMatrix = [[number, number], [number, number]];
/** 点或者类似点 */
export type PointLike = number[] | [number, number] | Point;
/** 点输入 */
export type PointInput = PointLike | number;
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
