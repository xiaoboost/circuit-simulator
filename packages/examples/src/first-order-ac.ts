import { Direction } from '@circuit/algorithm';
import { StoreData, ElectronicKind } from '@circuit/types';

export const data: StoreData = {
  version: '1.0.0',
  parts: [
    {
      kind: ElectronicKind.Resistance,
      referenceTag: '1',
      position: [740, 200],
      rotate: [[1, 0], [0, 1]],
      propertyValues: [
        {
          value: 200,
        },
      ],
      textDirection: Direction.Top,
    },
    {
      kind: ElectronicKind.Capacitor,
      referenceTag: '1',
      position: [820, 280],
      rotate: [[0, 1], [-1, 0]],
      propertyValues: [
        {
          value: 10,
          rank: 'u',
        },
      ],
      textDirection: Direction.Left,
    },
    {
      kind: ElectronicKind.ReferenceGround,
      referenceTag: '1',
      position: [740, 400],
      rotate: [[1, 0], [0, 1]],
      propertyValues: [],
      textDirection: Direction.Center,
    },
    {
      kind: ElectronicKind.VoltageMeter,
      referenceTag: 'in',
      position: [660, 280],
      rotate: [[1, 0], [0, 1]],
      propertyValues: [],
      textDirection: Direction.Right,
    },
    {
      kind: ElectronicKind.VoltageMeter,
      referenceTag: 'C1',
      position: [920, 280],
      rotate: [[1, 0], [0, 1]],
      propertyValues: [],
      textDirection: Direction.Right,
    },
    {
      kind: ElectronicKind.AcVoltageSource,
      referenceTag: '1',
      position: [560, 280],
      rotate: [[1, 0], [0, 1]],
      propertyValues: [
        {
          value: 20,
        },
        {
          value: 100,
        },
        {
          value: 0,
        },
        {
          value: 0,
        },
      ],
      textDirection: Direction.Left,
    },
  ],
  lines: [
    {
      path: [[780, 200], [820, 200]],
    },
    {
      path: [[740, 380], [740, 360]],
    },
    {
      path: [[740, 360], [820, 360]],
    },
    {
      path: [[920, 240], [920, 200], [820, 200]],
    },
    {
      path: [[820, 240], [820, 200]],
    },
    {
      path: [[920, 320], [920, 360], [820, 360]],
    },
    {
      path: [[820, 320], [820, 360]],
    },
    {
      path: [[660, 240], [660, 200]],
    },
    {
      path: [[660, 320], [660, 360]],
    },
    {
      path: [[560, 240], [560, 200], [660, 200]],
    },
    {
      path: [[660, 200], [700, 200]],
    },
    {
      path: [[560, 320], [560, 360], [660, 360]],
    },
    {
      path: [[660, 360], [740, 360]],
    },
  ],
};
