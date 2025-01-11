import test from 'ava';
import { RotateMatrix, Rotate, Point } from '@circuit/math';
import { loadData, loadSpace, createContext } from '../utils';

test('单独放置器件', ({ deepEqual }) => {
  const context = createContext();
  const { parts: [part] } = loadSpace(context, [
    {
      id: 'R_1',
      kind: 'Resistance',
      position: [100, 100],
    }
  ]);

  // 放置器件
  part.setMark();
  deepEqual(context.map.toData(), [
    {
      kind: 5,
      part: 'R_1',
      pin: 0,
      position: [60, 100],
    },
    {
      kind: 4,
      part: 'R_1',
      position: [80, 100],
    },
    {
      kind: 4,
      part: 'R_1',
      position: [100, 100],
    },
    {
      kind: 4,
      part: 'R_1',
      position: [120, 100],
    },
    {
      kind: 5,
      part: 'R_1',
      pin: 1,
      position: [140, 100],
    },
  ]);

  // 拿起器件
  part.deleteMark();
  deepEqual(context.map.toData(), []);
});

test('单独放置并且旋转器件', ({ deepEqual }) => {
  const context = createContext();
  const { parts: [part] } = loadSpace(context, [
    {
      id: 'R_1',
      kind: 'Resistance',
      position: [100, 100],
    }
  ]);

  // 放置器件
  part.setMark();
  deepEqual(context.map.toData(), [
    {
      kind: 5,
      part: 'R_1',
      pin: 0,
      position: [60, 100],
    },
    {
      kind: 4,
      part: 'R_1',
      position: [80, 100],
    },
    {
      kind: 4,
      part: 'R_1',
      position: [100, 100],
    },
    {
      kind: 4,
      part: 'R_1',
      position: [120, 100],
    },
    {
      kind: 5,
      part: 'R_1',
      pin: 1,
      position: [140, 100],
    },
  ]);

  // 顺时针旋转
  part.deleteMark();
  part.rotate = RotateMatrix[Rotate.Clockwise];
  part.setMark();
  deepEqual(context.map.toData(), [
    {
      kind: 5,
      part: 'R_1',
      pin: 0,
      position: [100, 60],
    },
    {
      kind: 4,
      part: 'R_1',
      position: [100, 80],
    },
    {
      kind: 4,
      part: 'R_1',
      position: [100, 100],
    },
    {
      kind: 4,
      part: 'R_1',
      position: [100, 120],
    },
    {
      kind: 5,
      part: 'R_1',
      pin: 1,
      position: [100, 140],
    },
  ]);

  // 拿起器件
  part.deleteMark();
  deepEqual(context.map.toData(), []);
});

test('单独放置并且移动器件', ({ deepEqual }) => {
  const context = createContext();
  const { parts: [part] } = loadSpace(context, [
    {
      id: 'R_1',
      kind: 'Resistance',
      position: [100, 100],
    }
  ]);

  // 放置器件
  part.setMark();
  deepEqual(context.map.toData(), [
    {
      kind: 5,
      part: 'R_1',
      pin: 0,
      position: [60, 100],
    },
    {
      kind: 4,
      part: 'R_1',
      position: [80, 100],
    },
    {
      kind: 4,
      part: 'R_1',
      position: [100, 100],
    },
    {
      kind: 4,
      part: 'R_1',
      position: [120, 100],
    },
    {
      kind: 5,
      part: 'R_1',
      pin: 1,
      position: [140, 100],
    },
  ]);

  // 移动器件
  part.deleteMark();
  part.position = part.position.add([40, 100]);
  part.setMark();
  deepEqual(context.map.toData(), [
    {
      kind: 5,
      part: 'R_1',
      pin: 0,
      position: [100, 200],
    },
    {
      kind: 4,
      part: 'R_1',
      position: [120, 200],
    },
    {
      kind: 4,
      part: 'R_1',
      position: [140, 200],
    },
    {
      kind: 4,
      part: 'R_1',
      position: [160, 200],
    },
    {
      kind: 5,
      part: 'R_1',
      pin: 1,
      position: [180, 200],
    },
  ]);

  // 拿起器件
  part.deleteMark();
  deepEqual(context.map.toData(), []);
});

test('变更单独器件编号', ({ deepEqual }) => {
  const context = createContext();
  const { parts: [part] } = loadSpace(context, [
    {
      id: 'R_1',
      kind: 'Resistance',
      position: [100, 100],
    },
  ]);

  part.changeId('R_2');

  deepEqual(context.map.toData(), [
    {
      kind: 5,
      part: 'R_2',
      pin: 0,
      position: [60, 100],
    },
    {
      kind: 4,
      part: 'R_2',
      position: [80, 100],
    },
    {
      kind: 4,
      part: 'R_2',
      position: [100, 100],
    },
    {
      kind: 4,
      part: 'R_2',
      position: [120, 100],
    },
    {
      kind: 5,
      part: 'R_2',
      pin: 1,
      position: [140, 100],
    },
  ]);
});

test('放下器件之前检测是否被占用', ({ true: isTrue, false: isFalse }) => {
  const context = createContext();
  const { parts } = loadSpace(context, [
    {
      id: 'R_1',
      kind: 'Resistance',
      position: [100, 100],
    },
    {
      id: 'R_2',
      kind: 'Resistance',
      position: [120, 100],
    },
  ]);

  // 放下第一个器件
  parts[0].setMark();
  isTrue(parts[1].isOccupied());

  // 移动第二个器件
  parts[1].position = Point.from([200, 200]);
  isFalse(parts[1].isOccupied());
});
