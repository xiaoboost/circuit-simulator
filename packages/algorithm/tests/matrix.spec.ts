import test from 'ava';

import {
  Point,
  Rotate,
  RotateMatrix,
  RotateMatrixSet,
  copyMatrix,
  invertRotateMatrix,
  isMatrixEqual,
} from '../src';

test('复制矩阵', (it) => {
  const ma: RotateMatrix = [[0, 1], [-1, 0]];
  const copy = copyMatrix(ma);

  it.false(copy === ma);
  it.deepEqual(copy, ma);
});

test('矩阵是否相等', (it) => {
  const ma1: RotateMatrix = [[0, 1], [-1, 0]];
  const ma2: RotateMatrix = [[0, 1], [-1, 0]];
  const ma3: RotateMatrix = [[0, 1], [-1, 1]];

  it.true(isMatrixEqual(ma1, ma2));
  it.false(isMatrixEqual(ma2, ma3));
});

test('逆矩阵', (it) => {
  // 单位矩阵的逆矩阵相同
  it.true(isMatrixEqual(invertRotateMatrix([[1, 0], [0, 1]]), [[1, 0], [0, 1]]));
  // 逆矩阵
  it.true(isMatrixEqual(invertRotateMatrix([[0, 1], [-1, 0]]), [[0, -1], [1, 0]]));


  it.throws(
    () => invertRotateMatrix([[0, 0], [0, 0]]),
    undefined,
    '此矩阵没有逆矩阵：0, 0, 0, 0',
  );

  it.throws(
    () => invertRotateMatrix([[0, 0, 0, 0]] as any),
    undefined,
    '输入必须是 2X2 矩阵',
  );
});

test('四个方向矩阵', ({ deepEqual }) => {
  const origin = Point.from([20, 0]);

  deepEqual(
    origin.rotate(RotateMatrixSet[Rotate.Same]).toData(),
    [20, 0],
  );

  deepEqual(
    origin.rotate(RotateMatrixSet[Rotate.Reverse]).toData(),
    [-20, 0],
  );

  deepEqual(
    origin.rotate(RotateMatrixSet[Rotate.Clockwise]).toData(),
    [0, 20],
  );

  deepEqual(
    origin.rotate(RotateMatrixSet[Rotate.AntiClockwise]).toData(),
    [0, -20],
  );
});
