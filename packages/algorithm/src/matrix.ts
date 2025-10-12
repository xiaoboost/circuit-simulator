import { RotateMatrixSet } from './constant';
import { Point } from './point';
import { RotateMatrix, PointLike, Rotate } from './types';

/** 旋转矩阵的逆矩阵 */
export function invertRotateMatrix(matrix: RotateMatrix): RotateMatrix {
  // 验证矩阵维度
  if (matrix.length !== 2 || matrix[0].length !== 2 || matrix[1].length !== 2) {
    throw new Error('输入必须是 2X2 矩阵');
  }

  // 提取矩阵元素
  const [[a, b], [c, d]] = matrix;
  // 计算行列式
  const determinant = a * d - b * c;
  // 处理不可逆情况
  if (determinant === 0) {
    throw new Error(`此矩阵没有逆矩阵：${matrix.join(',')}`);
  }

  // 计算逆矩阵
  const invDet = 1 / determinant;

  return [
    [d * invDet, -b * invDet],
    [-c * invDet, a * invDet],
  ];
}

/** 向量旋转 */
export function rotateVector(vector: PointLike, rotate: RotateMatrix): Point {
  return Point.from(vector).rotate(rotate);
}

function validateMatrix(matrix: RotateMatrix): void {
  if (matrix.length !== 2 || matrix[0].length !== 2 || matrix[1].length !== 2) {
    throw new Error('输入矩阵必须是 2X2 矩阵');
  }
}

/**
 * 矩阵前乘
 *
 * @description 在 matrix1 的前面乘以 matrix2，即 matrix2 * matrix1
 */
export function preMatrixMultiply(matrix1: RotateMatrix, matrix2: RotateMatrix): RotateMatrix {
  validateMatrix(matrix1);
  validateMatrix(matrix2);

  const [[a, b], [c, d]] = matrix1;
  const [[e, f], [g, h]] = matrix2;

  return [
    [e * a + f * c, e * b + f * d],
    [g * a + h * c, g * b + h * d],
  ];
}

/**
 * 矩阵后乘
 *
 * @description 在 matrix1 的后面乘以 matrix2，即 matrix1 * matrix2
 */
export function postMatrixMultiply(matrix1: RotateMatrix, matrix2: RotateMatrix): RotateMatrix {
  validateMatrix(matrix1);
  validateMatrix(matrix2);

  const [[a, b], [c, d]] = matrix1;
  const [[e, f], [g, h]] = matrix2;

  return [
    [a * e + b * g, a * f + b * h],
    [c * e + d * g, c * f + d * h],
  ];
}

/** 矩阵是否相等 */
export function isMatrixEqual(matrix1: RotateMatrix, matrix2: RotateMatrix): boolean {
  return matrix1.every((row, i) => row.every((value, j) => value === matrix2[i][j]));
}

/** 不旋转矩阵 */
export function isMatrixNotRotate(matrix: RotateMatrix): boolean {
  return isMatrixEqual(matrix, RotateMatrixSet[Rotate.Same]);
}

/** 复制矩阵 */
export function copyMatrix(matrix: RotateMatrix): RotateMatrix {
  return matrix.map((row) => row.slice()) as RotateMatrix;
}
