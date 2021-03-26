import Matrix from 'src/lib/matrix';

describe('矩阵 matrix.ts', () => {
  test('create a Matrix', () => {
    let ma: Matrix;
    // 0 行列式填充以及从数组到行列式
    expect(Matrix.from([[0, 0, 0], [0, 0, 0]])).toEqualMatrix(new Matrix(2, 3, 0));

    // 0矩阵
    ma = new Matrix(5);
    for (let i = 0; i < 5; i++) {
      for (let j = 0; j < 5; j++) {
        expect(ma.get(i, j)).toBe(0);
      }
    }

    // 单位矩阵
    ma = new Matrix(6, 'E');
    for (let i = 0; i < 6; i++) {
      for (let j = 0; j < 6; j++) {
        if (i === j) {
          expect(ma.get(i, j)).toBe(1);
        }
        else {
          expect(ma.get(i, j)).toBe(0);
        }
      }
    }

    // 矩阵填充
    ma = new Matrix(7, 12);
    for (let i = 0; i < 7; i++) {
      for (let j = 0; j < 7; j++) {
        expect(ma.get(i, j)).toBe(12);
      }
    }

    // 行列式
    ma = new Matrix(5, 6, 14);
    for (let i = 0; i < 5; i++) {
      for (let j = 0; j < 6; j++) {
        expect(ma.get(i, j)).toBe(14);
      }
    }

    // 单位行列式
    ma = new Matrix(5, 7, 'E');
    for (let i = 0; i < 5; i++) {
      for (let j = 0; j < 7; j++) {
        if (i === j) {
          expect(ma.get(i, j)).toBe(1);
        }
        else {
          expect(ma.get(i, j)).toBe(0);
        }
      }
    }

    // 单位行列式
    ma = new Matrix(7, 5, 'E');
    for (let i = 0; i < 7; i++) {
      for (let j = 0; j < 5; j++) {
        if (i === j) {
          expect(ma.get(i, j)).toBe(1);
        }
        else {
          expect(ma.get(i, j)).toBe(0);
        }
      }
    }

    // 复制矩阵
    const copy = Matrix.from(ma);
    expect(copy === ma).toBeFalse();
    expect(copy).toEqualMatrix(ma);

    // 非法矩阵
    // 含有 NaN
    expect(() => Matrix.from([[0, NaN, 0], [0, 0, 0]])).toThrowError('(matrix) this is not a matrix.');
    // 列不连续
    expect(() => Matrix.from([[0, 0, 0], [0, 0]])).toThrowError('(matrix) this is not a matrix.');
    // 行不连续
    const error = [[0, 0, 0], [0, 0, 0], [0, 0, 0]];
    Object.defineProperty(error, '1', { enumerable: false });
    expect(() => Matrix.from(error)).toThrowError('(matrix) this is not a matrix.');
  });
  test('Matrix.prototype.join()', () => {
    const ma = Matrix.from([[1, 2, 3, 4], [5, 6, 7, 8], [9, 10, 11, 12], [13, 14, 15, 16]]);
    expect(ma.join()).toBe('1,2,3,4,5,6,7,8,9,10,11,12,13,14,15,16');
    expect(ma.join('; ')).toBe('1; 2; 3; 4; 5; 6; 7; 8; 9; 10; 11; 12; 13; 14; 15; 16');
  });
  test('Matrix.prototype.get/set()', () => {
    const ma = Matrix.from([[1, 2, 3, 4], [5, 6, 7, 8], [9, 10, 11, 12]]);
    expect(ma.get(1, 2)).toBe(7);

    ma.set(2, 1, 100);
    expect(ma.get(2, 1)).toBe(100);

    expect(ma.get(5, 5)).toBeUndefined();
  });
  test('Matrix.prototype.getRow/getColumn()', () => {
    const ma = Matrix.from([[1, 2, 3, 4], [5, 6, 7, 8], [9, 10, 11, 12], [13, 14, 15, 16]]);

    expect(ma.getRow(0)).toEqual([1, 2, 3, 4]);
    expect(ma.getRow(-1)).toEqual([13, 14, 15, 16]);
    expect(() => ma.getRow(9)).toThrowError('(matrix) index of row out of bounds.');

    expect(ma.getColumn(0)).toEqual([1, 5, 9, 13]);
    expect(ma.getColumn(-1)).toEqual([4, 8, 12, 16]);
    expect(() => ma.getColumn(9)).toThrowError('(matrix) index of column out of bounds.');
  });
  test('Matrix.prototype.exchangeRow/exchangeColumn()', () => {
    const ma = Matrix.from([
      [1, 2, 3, 4],
      [5, 6, 7, 8],
      [9, 10, 11, 12],
      [13, 14, 15, 16],
    ]);

    ma.exchangeRow(1, 1);
    expect(ma.getRow(1)).toEqual([5, 6, 7, 8]);

    ma.exchangeRow(1, 2);
    expect(ma.getRow(1)).toEqual([9, 10, 11, 12]);
    expect(ma.getRow(2)).toEqual([5, 6, 7, 8]);

    ma.exchangeColumn(2, 2);
    expect(ma.getColumn(2)).toEqual([3, 11, 7, 15]);

    ma.exchangeColumn(1, 3);
    expect(ma.getColumn(1)).toEqual([4, 12, 8, 16]);
    expect(ma.getColumn(3)).toEqual([2, 10, 6, 14]);
  });
  test('Matrix.prototype.transpose()', () => {
    const ma1 = Matrix.from([
      [1,  2,  3,  4],
      [5,  6,  7,  8],
      [9, 10, 11, 12],
    ]);

    const ma2 = Matrix.from([
      [1, 5,  9],
      [2, 6, 10],
      [3, 7, 11],
      [4, 8, 12],
    ]);

    expect(ma1.transpose()).toEqualMatrix(ma2);
  });
  test('Matrix.prototype.factor()', () => {
    const ma1 = Matrix.from([
      [1,  2,  3,  4],
      [5,  6,  7,  8],
      [9, 10, 11, 12],
    ]);

    const ma2 = Matrix.from([
      [ 2,  4,  6,  8],
      [10, 12, 14, 16],
      [18, 20, 22, 24],
    ]);

    expect(ma1.factor(2)).toEqualMatrix(ma2);
  });
  test('Matrix.prototype.add()', () => {
    const ma1 = Matrix.from([
      [1,  2,  3,  4],
      [5,  6,  7,  8],
      [9, 10, 11, 12],
    ]);

    const ma2 = Matrix.from([
      [ 2,  4,  6,  8],
      [10, 12, 14, 16],
      [18, 20, 22, 24],
    ]);

    const ma3 = Matrix.from([
      [ 3,  6,  9, 12],
      [15, 18, 21, 24],
      [27, 30, 33, 36],
    ]);

    expect(ma1.add(ma2)).toEqualMatrix(ma3);

    const ma4 = new Matrix(2, 2, 0);
    expect(() => ma1.add(ma4)).toThrowError('(matrix) ma can not be add with this.');
  });
  test('Matrix.prototype.mul/multo()', () => {
    const matrixA = Matrix.from([
      [1, 2, 3, 4],
      [5, 6, 7, 8],
      [9, 10, 11, 12],
    ]);

    const matrixB = Matrix.from([
      [1, 2, 3],
      [4, 5, 6],
      [7, 8, 9],
      [10, 11, 12],
    ]);
    const matrixC = [
      [0.9572, 0.4218, 0.6557],
      [0.4854, 0.9157, 0.0357],
      [0.8003, 0.7922, 0.8491],
      [0.1419, 0.9595, 0.9342],
    ];

    expect(matrixA.mul(matrixB)).toEqualMatrix(Matrix.from([
      [70, 80, 90],
      [158, 184, 210],
      [246, 288, 330],
    ]));

    expect(matrixA.multo(matrixB)).toEqualMatrix(Matrix.from([
      [38, 44, 50, 56],
      [83, 98, 113, 128],
      [128, 152, 176, 200],
      [173, 206, 239, 272],
    ]));

    expect(matrixA.mul(matrixC).map((n) => Number(n.toFixed(4)))).toEqualMatrix(Matrix.from([
      [ 4.8965,  8.4678,  7.0112],
      [14.4357, 20.8246,   16.91],
      [23.9749, 33.1814, 26.8088],
    ]));

    expect(matrixA.multo(matrixC).map((n) => Number(n.toFixed(4)))).toEqualMatrix(Matrix.from([
      [ 8.9675, 11.0022, 13.0369, 15.0716],
      [ 5.3852,   6.822,  8.2588,  9.6956],
      [12.4032, 14.8448, 17.2864,  19.728],
      [13.3472, 15.3828, 17.4184,  19.454],
    ]));

    expect(() => matrixA.mul([[0]])).toThrowError('(matrix) this can not be multiplied with ma.');
    expect(() => matrixA.multo([[0]])).toThrowError('(matrix) ma can not be multiplied with this.');
  });
  test('Matrix.prototype.inverse()', () => {
    expect(new Matrix(4, 'E').inverse()).toEqualMatrix(new Matrix(4, 'E'));

    expect(Matrix.from([
      [7.5469,   1.19, 2.2381,  8.909, 2.5751],
      [2.7603, 4.9836, 7.5127, 9.5929, 8.4072],
      [ 6.797, 9.5974,  2.551, 5.4722, 2.5428],
      [ 6.551, 3.4039, 5.0596, 1.3862, 8.1428],
      [1.6261, 5.8527, 6.9908, 1.4929, 2.4352],
    ]).inverse().map((n) => Number(n.toFixed(4)))).toEqualMatrix(Matrix.from([
      [ 0.1046, - 0.112, -0.0019,  0.0727,  0.0349],
      [-0.0943,  0.0227,  0.1264, -0.0268, -0.0209],
      [ 0.0806, -0.0416, -0.1132, -0.0102,  0.2106],
      [ 0.0457,  0.0752,  0.0081, -0.0832, -0.0382],
      [-0.1026,  0.0937,  0.0177,   0.096, -0.1438],
    ]));

    expect(() => new Matrix(3, 4, 0).inverse()).toThrowError('(matrix) only the matrix can be decomposed.');
    expect(() => new Matrix(3).inverse()).toThrowError('(matrix) this matrix has no inverse.');
  });
  test('Matrix.prototype.concatRight/concatBottom()', () => {
    const ma1 = Matrix.from([
      [1,  2],
      [5,  6],
      [9, 10],
    ]);

    const ma2 = Matrix.from([
      [ 2,  3],
      [ 6,  7],
      [10, 11],
    ]);

    const ma3 = Matrix.from([
      [ 4],
      [ 8],
      [12],
    ]);

    expect(ma1.concatRight(ma2, ma3)).toEqualMatrix(Matrix.from([
      [1,  2,  2,  3,  4],
      [5,  6,  6,  7,  8],
      [9, 10, 10, 11, 12],
    ]));
  });
});
