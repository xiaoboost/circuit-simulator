import { describe, it, expect } from 'vitest';

import {
  Point,
  Rotate,
  RotateMatrix,
  RotateMatrixSet,
  copyMatrix,
  invertRotateMatrix,
  isMatrixEqual,
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
        invertRotateMatrix([[0, 0, 0, 0]] as any);
      }).toThrow('输入必须是 2X2 矩阵');
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
