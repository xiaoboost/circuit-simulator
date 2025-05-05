import { PartRotateMatrix } from '@circuit/electronics';

/** 旋转矩阵的逆矩阵 */
export function invert2x2Matrix(matrix: PartRotateMatrix): PartRotateMatrix {
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
