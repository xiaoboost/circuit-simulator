import { Point } from '@circuit/math';
import test from 'ava';
import { Connection } from '../src/mark/connection';

test('上下左右四个点', ({ true: isTrue, falsy }) => {
  const centerPosition = Point.from([100, 100]);
  const center = new Connection(centerPosition, 'node');
  const leftNode = Point.from([-20, 0]);
  const rightNode = Point.from([20, 0]);
  const topNode = Point.from([0, -20]);
  const bottomNode = Point.from([0, 20]);

  falsy(center.left);
  falsy(center.right);
  falsy(center.top);
  falsy(center.bottom);

  center.addVector(leftNode);
  center.addVector(rightNode);

  isTrue(center.left);
  isTrue(center.right);
  falsy(center.top);
  falsy(center.bottom);

  center.addVector(topNode);
  center.addVector(bottomNode);

  isTrue(center.left);
  isTrue(center.right);
  isTrue(center.top);
  isTrue(center.bottom);

  center.deleteVector(leftNode);
  center.deleteVector(bottomNode);

  falsy(center.left);
  isTrue(center.right);
  isTrue(center.top);
  falsy(center.bottom);

  center.deleteVector(rightNode);
  center.deleteVector(topNode);

  falsy(center.left);
  falsy(center.right);
  falsy(center.top);
  falsy(center.bottom);
});

test('上下左右四个方向', ({ true: isTrue, falsy }) => {
  const centerPosition = Point.from([100, 100]);
  const center = new Connection(centerPosition, 'node');
  const leftVector = Point.from([-20, 0]);
  const rightVector = Point.from([20, 0]);
  const topVector = Point.from([0, -20]);
  const bottomVector = Point.from([0, 20]);

  falsy(center.left);
  falsy(center.right);
  falsy(center.top);
  falsy(center.bottom);

  center.addVector(leftVector);
  center.addVector(rightVector);

  isTrue(center.left);
  isTrue(center.right);
  falsy(center.top);
  falsy(center.bottom);

  center.addVector(topVector);
  center.addVector(bottomVector);

  isTrue(center.left);
  isTrue(center.right);
  isTrue(center.top);
  isTrue(center.bottom);

  center.deleteVector(leftVector);
  center.deleteVector(bottomVector);

  falsy(center.left);
  isTrue(center.right);
  isTrue(center.top);
  falsy(center.bottom);

  center.deleteVector(rightVector);
  center.deleteVector(topVector);

  falsy(center.left);
  falsy(center.right);
  falsy(center.top);
  falsy(center.bottom);
});

test('toData', ({ deepEqual }) => {
  const center = new Connection(Point.from([100, 100]), 'node');
  const leftVector = Point.from([-20, 0]);
  const bottomVector = Point.from([0, 20]);

  center.addVector(leftVector);
  center.addVector(bottomVector);

  deepEqual(center.toData(), [0, 0, 1, 1]);
});

test('fromData', ({ true: isTrue, false: falsy }) => {
  const center = new Connection(Point.from([100, 100]), 'node');

  center.fromData([0, 0, 1, 1]);

  isTrue(center.left);
  falsy(center.right);
  falsy(center.top);
  isTrue(center.bottom);
});

test('getConnectedPoints', ({ deepEqual }) => {
  const center = new Connection(Point.from([100, 100]), 'node');

  center.fromData([0, 1, 1, 0]);

  const connectedPoints = center
    .getConnectedPoints()
    .map((item) => item ? item.toData() : undefined);

  deepEqual(
    connectedPoints,
    [
      undefined,
      [120, 100],
      [100, 120],
      undefined,
    ],
  );
});
