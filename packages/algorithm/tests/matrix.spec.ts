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

// describe('矩阵', () => {
  it('复制矩阵', () => {
    const ma: RotateMatrix = [[0, 1], [-1, 0]];
    const copy = copyMatrix(ma);

    expect(copy === ma).toBe(false);
    expect(copy).toEqual(ma);
  });

  it('矩阵是否相等', () => {
    const ma1: RotateMatrix = [[0, 1], [-1, 0]];
    const ma2: RotateMatrix = [[0, 1], [-1, 0]];
    const ma3: RotateMatrix = [[0, 1], [-1, 1]];

    expect(isMatrixEqual(ma1, ma2)).toBe(true);
    expect(isMatrixEqual(ma2, ma3)).toBe(false);
  });

  it('逆矩阵', () => {
    // 单位矩阵的逆矩阵相同
    expect(isMatrixEqual(invertRotateMatrix([[1, 0], [0, 1]]), [[1, 0], [0, 1]])).toBe(true);
    // 逆矩阵
    expect(isMatrixEqual(invertRotateMatrix([[0, 1], [-1, 0]]), [[0, -1], [1, 0]])).toBe(true);


    expect(() => {
      invertRotateMatrix([[0, 0], [0, 0]]);
    }).toThrow('此矩阵没有逆矩阵：0,0,0,0');

    expect(() => {
      invertRotateMatrix([[0, 0, 0, 0]] as any);
    }).toThrow('输入必须是 2X2 矩阵');
  });

  it('四个方向矩阵', () => {
    const origin = Point.from([20, 0]);

    expect(origin.rotate(RotateMatrixSet[Rotate.Same]).toData())
      .toEqual([20, 0]);

    expect(origin.rotate(RotateMatrixSet[Rotate.Reverse]).toData())
      .toEqual([-20, 0]);

    expect(origin.rotate(RotateMatrixSet[Rotate.Clockwise]).toData())
      .toEqual([0, 20]);

    expect(origin.rotate(RotateMatrixSet[Rotate.AntiClockwise]).toData())
      .toEqual([0, -20]);
  });
// });
