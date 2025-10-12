import { describe, it, expect } from 'vitest';

import {
  Point,
  Rotate,
  RotateMatrix,
  RotateMatrixSet,
  copyMatrix,
  invertRotateMatrix,
  isMatrixEqual,
  preMatrixMultiply,
  postMatrixMultiply,
} from '../src';

describe('矩阵', () => {
  describe('copyMatrix()', () => {
    it('应该返回矩阵的深拷贝', () => {
      const ma: RotateMatrix = [[0, 1], [-1, 0]];
      const copy = copyMatrix(ma);

      expect(copy === ma).toBe(false);
    });

    it('复制的矩阵应该与原矩阵内容相同', () => {
      const ma: RotateMatrix = [[0, 1], [-1, 0]];
      const copy = copyMatrix(ma);

      expect(copy).toEqual(ma);
    });
  });

  describe('isMatrixEqual()', () => {
    it('相同矩阵应该返回true', () => {
      const ma1: RotateMatrix = [[0, 1], [-1, 0]];
      const ma2: RotateMatrix = [[0, 1], [-1, 0]];

      expect(isMatrixEqual(ma1, ma2)).toBe(true);
    });

    it('不同矩阵应该返回false', () => {
      const ma1: RotateMatrix = [[0, 1], [-1, 0]];
      const ma2: RotateMatrix = [[0, 1], [-1, 1]];

      expect(isMatrixEqual(ma1, ma2)).toBe(false);
    });
  });

  describe('invertRotateMatrix()', () => {
    it('单位矩阵的逆矩阵应该相同', () => {
      const result = invertRotateMatrix([[1, 0], [0, 1]]);
      expect(isMatrixEqual(result, [[1, 0], [0, 1]])).toBe(true);
    });

    it('应该正确计算逆矩阵', () => {
      const result = invertRotateMatrix([[0, 1], [-1, 0]]);
      expect(isMatrixEqual(result, [[0, -1], [1, 0]])).toBe(true);
    });

    it('零矩阵应该抛出异常', () => {
      expect(() => {
        invertRotateMatrix([[0, 0], [0, 0]]);
      }).toThrow('此矩阵没有逆矩阵：0,0,0,0');
    });

    it('非2x2矩阵应该抛出异常', () => {
      expect(() => {
        invertRotateMatrix([
          [
            0, 0, 0, 0,
          ],
        ] as any);
      }).toThrow('输入必须是 2X2 矩阵');
    });
  });

  describe('preMatrixMultiply()', () => {
    it('单位矩阵前乘应该保持原矩阵不变', () => {
      const matrix: RotateMatrix = [[2, 3], [4, 5]];
      const identity: RotateMatrix = [[1, 0], [0, 1]];
      const result = preMatrixMultiply(matrix, identity);
      expect(isMatrixEqual(result, matrix)).toBe(true);
    });

    it('前乘应该满足结合律：A * (B * C) = (A * B) * C', () => {
      const A: RotateMatrix = [[1, 2], [3, 4]];
      const B: RotateMatrix = [[2, 0], [1, 3]];
      const C: RotateMatrix = [[1, 1], [0, 2]];

      const leftSide = preMatrixMultiply(preMatrixMultiply(C, B), A);
      const rightSide = preMatrixMultiply(C, preMatrixMultiply(B, A));

      expect(isMatrixEqual(leftSide, rightSide)).toBe(true);
    });

    it('前乘顺序应该影响结果：A * B ≠ B * A', () => {
      const A: RotateMatrix = [[1, 0], [0, -1]]; // Y轴翻转
      const B: RotateMatrix = [[0, 1], [-1, 0]]; // 顺时针90度

      const AB = preMatrixMultiply(B, A);
      const BA = preMatrixMultiply(A, B);

      expect(isMatrixEqual(AB, BA)).toBe(false);
    });

    it('前乘应该正确组合旋转操作', () => {
      const clockwise90: RotateMatrix = [[0, 1], [-1, 0]];
      const reverse: RotateMatrix = [[-1, 0], [0, -1]];

      // 先顺时针90度，再反向 = 逆时针90度
      const result = preMatrixMultiply(clockwise90, reverse);
      const expected: RotateMatrix = [[0, -1], [1, 0]];

      expect(isMatrixEqual(result, expected)).toBe(true);
    });
  });

  describe('postMatrixMultiply()', () => {
    it('单位矩阵后乘应该保持原矩阵不变', () => {
      const matrix: RotateMatrix = [[2, 3], [4, 5]];
      const identity: RotateMatrix = [[1, 0], [0, 1]];
      const result = postMatrixMultiply(matrix, identity);
      expect(isMatrixEqual(result, matrix)).toBe(true);
    });

    it('后乘应该满足结合律：(A * B) * C = A * (B * C)', () => {
      const A: RotateMatrix = [[1, 2], [3, 4]];
      const B: RotateMatrix = [[2, 0], [1, 3]];
      const C: RotateMatrix = [[1, 1], [0, 2]];

      const leftSide = postMatrixMultiply(postMatrixMultiply(A, B), C);
      const rightSide = postMatrixMultiply(A, postMatrixMultiply(B, C));

      expect(isMatrixEqual(leftSide, rightSide)).toBe(true);
    });

    it('后乘顺序应该影响结果：A * B ≠ B * A', () => {
      const A: RotateMatrix = [[1, 0], [0, -1]]; // Y轴翻转
      const B: RotateMatrix = [[0, 1], [-1, 0]]; // 顺时针90度

      const AB = postMatrixMultiply(A, B);
      const BA = postMatrixMultiply(B, A);

      expect(isMatrixEqual(AB, BA)).toBe(false);
    });

    it('后乘应该正确组合旋转操作', () => {
      const clockwise90: RotateMatrix = [[0, 1], [-1, 0]];
      const reverse: RotateMatrix = [[-1, 0], [0, -1]];

      // 先反向，再顺时针90度 = 逆时针90度
      const result = postMatrixMultiply(reverse, clockwise90);
      const expected: RotateMatrix = [[0, -1], [1, 0]];

      expect(isMatrixEqual(result, expected)).toBe(true);
    });
  });

  describe('矩阵乘法关系', () => {
    it('前乘和后乘应该满足转置关系', () => {
      const A: RotateMatrix = [[1, 2], [3, 4]];
      const B: RotateMatrix = [[2, 0], [1, 3]];

      // (A * B)^T = B^T * A^T
      const AB = postMatrixMultiply(A, B);
      const AB_transpose: RotateMatrix = [[AB[0][0], AB[1][0]], [AB[0][1], AB[1][1]]];

      const A_transpose: RotateMatrix = [[A[0][0], A[1][0]], [A[0][1], A[1][1]]];
      const B_transpose: RotateMatrix = [[B[0][0], B[1][0]], [B[0][1], B[1][1]]];
      const BTA = preMatrixMultiply(A_transpose, B_transpose);

      expect(isMatrixEqual(AB_transpose, BTA)).toBe(true);
    });

    it('与单位矩阵相乘时，矩阵乘法满足交换律', () => {
      const I: RotateMatrix = [[1, 0], [0, 1]];
      const M: RotateMatrix = [[5, 6], [7, 8]];

      // 计算 I * M
      const result_I_times_M = postMatrixMultiply(I, M);
      // 计算 M * I
      const result_M_times_I = postMatrixMultiply(M, I);

      // 在数学上，I * M = M * I = M。因此这两个结果必须相等。
      expect(isMatrixEqual(result_I_times_M, result_M_times_I)).toBe(true);
    });

    it('在一般情况下，矩阵乘法不满足交换律 (使用 postMatrixMultiply)', () => {
      const C: RotateMatrix = [[1, 2], [3, 4]];
      const D: RotateMatrix = [[2, 0], [0, 1]];

      // postMatrixMultiply(ma1, ma2) => ma1 * ma2
      const result_C_times_D = postMatrixMultiply(C, D); // C * D
      const result_D_times_C = postMatrixMultiply(D, C); // D * C

      // C * D ≠ D * C
      expect(isMatrixEqual(result_C_times_D, result_D_times_C)).toBe(false);
    });

    it('在一般情况下，矩阵乘法不满足交换律 (使用 preMatrixMultiply)', () => {
      const C: RotateMatrix = [[1, 2], [3, 4]];
      const D: RotateMatrix = [[2, 0], [0, 1]];

      // preMatrixMultiply(ma1, ma2) => ma2 * ma1
      const result_C_times_D = preMatrixMultiply(D, C); // C * D
      const result_D_times_C = preMatrixMultiply(C, D); // D * C

      // C * D ≠ D * C
      expect(isMatrixEqual(result_C_times_D, result_D_times_C)).toBe(false);
    });
  });

  describe('旋转矩阵应用', () => {
    it('相同旋转应该保持原位置', () => {
      const origin = Point.from([20, 0]);
      const result = origin.rotate(RotateMatrixSet[Rotate.Same]).toData();
      expect(result).toEqual([20, 0]);
    });

    it('反向旋转应该翻转x坐标', () => {
      const origin = Point.from([20, 0]);
      const result = origin.rotate(RotateMatrixSet[Rotate.Reverse]).toData();
      expect(result).toEqual([-20, 0]);
    });

    it('顺时针旋转应该交换坐标', () => {
      const origin = Point.from([20, 0]);
      const result = origin.rotate(RotateMatrixSet[Rotate.Clockwise]).toData();
      expect(result).toEqual([0, 20]);
    });

    it('逆时针旋转应该交换坐标并取负', () => {
      const origin = Point.from([20, 0]);
      const result = origin.rotate(RotateMatrixSet[Rotate.AntiClockwise]).toData();
      expect(result).toEqual([0, -20]);
    });
  });
});
