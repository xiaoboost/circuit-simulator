import { Direction } from '@circuit/algorithm';
import { type StoreData, ElectronicKind } from '@circuit/types';

export const data: StoreData = {
  version: '1.0.0',
  parts: [
    {
      kind: ElectronicKind.DcVoltageSource,
      referenceTag: '1',
      position: [580, 280],
      rotate: [[1, 0], [0, 1]],
      propertyValues: [
        {
          value: 10,
        },
      ],
      textDirection: Direction.Left,
    },
    {
      kind: ElectronicKind.Resistance,
      referenceTag: '1',
      position: [740, 200],
      rotate: [[1, 0], [0, 1]],
      propertyValues: [
        {
          value: 1,
          rank: 'k',
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
          value: 1,
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
      textDirection: Direction.Center,
    },
    {
      kind: ElectronicKind.VoltageMeter,
      referenceTag: 'in',
      position: [660, 280],
      rotate: [[1, 0], [0, 1]],
      textDirection: Direction.Right,
    },
    {
      kind: ElectronicKind.VoltageMeter,
      referenceTag: 'C1',
      position: [920, 280],
      rotate: [[1, 0], [0, 1]],
      textDirection: Direction.Right,
    },
  ],
  lines: [
    {
      path: [[780, 200], [820, 200]],
    },
    {
      path: [
        [580, 240], [580, 200], [660, 200],
      ],
    },
    {
      path: [
        [580, 320], [580, 360], [660, 360],
      ],
    },
    {
      path: [[740, 380], [740, 360]],
    },
    {
      path: [[740, 360], [820, 360]],
    },
    {
      path: [
        [920, 240], [920, 200], [820, 200],
      ],
    },
    {
      path: [[820, 240], [820, 200]],
    },
    {
      path: [
        [920, 320], [920, 360], [820, 360],
      ],
    },
    {
      path: [[820, 320], [820, 360]],
    },
    {
      path: [[660, 240], [660, 200]],
    },
    {
      path: [[660, 200], [700, 200]],
    },
    {
      path: [[660, 320], [660, 360]],
    },
    {
      path: [[660, 360], [740, 360]],
    },
  ],
};
