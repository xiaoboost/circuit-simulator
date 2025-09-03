import { Direction } from '@circuit/algorithm';
import { type StoreData, ElectronicKind } from '@circuit/types';

export const data: StoreData = {
  version: '1.0.0',
  parts: [
    {
      kind: ElectronicKind.Resistance,
      referenceTag: '1',
      position: [860, 180],
      rotate: [[0, 1], [-1, 0]],
      propertyValues: [
        {
          value: 10,
          rank: 'k',
        },
      ],
      textDirection: Direction.Left,
    },
    {
      kind: ElectronicKind.Resistance,
      referenceTag: '2',
      position: [860, 380],
      rotate: [[0, 1], [-1, 0]],
      propertyValues: [
        {
          value: 5,
          rank: 'k',
        },
      ],
      textDirection: Direction.Left,
    },
    {
      kind: ElectronicKind.Resistance,
      referenceTag: '3',
      position: [960, 280],
      rotate: [[1, 0], [0, 1]],
      propertyValues: [
        {
          value: 1,
          rank: 'k',
        },
      ],
      textDirection: Direction.Bottom,
    },
    {
      kind: ElectronicKind.Resistance,
      referenceTag: '4',
      position: [1060, 180],
      rotate: [[0, 1], [-1, 0]],
      propertyValues: [
        {
          value: 5,
          rank: 'k',
        },
      ],
      textDirection: Direction.Left,
    },
    {
      kind: ElectronicKind.Resistance,
      referenceTag: '5',
      position: [1060, 380],
      rotate: [[0, 1], [-1, 0]],
      propertyValues: [
        {
          value: 10,
          rank: 'k',
        },
      ],
      textDirection: Direction.Left,
    },
    {
      kind: ElectronicKind.AcVoltageSource,
      referenceTag: '1',
      position: [740, 280],
      rotate: [[1, 0], [0, 1]],
      propertyValues: [
        {
          value: 50,
        },
        {
          value: 50,
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
    {
      kind: ElectronicKind.VoltageMeter,
      referenceTag: 'R4',
      position: [1160, 180],
      rotate: [[1, 0], [0, 1]],
      textDirection: Direction.Right,
    },
    {
      kind: ElectronicKind.CurrentMeter,
      referenceTag: 'R4',
      position: [960, 100],
      rotate: [[1, 0], [0, 1]],
      textDirection: Direction.Top,
    },
    {
      kind: ElectronicKind.ReferenceGround,
      referenceTag: '1',
      position: [740, 500],
      rotate: [[1, 0], [0, 1]],
      textDirection: Direction.Center,
    },
  ],
  lines: [
    {
      path: [
        [740, 240], [740, 100], [860, 100],
      ],
    },
    {
      path: [[1060, 140], [1060, 100]],
    },
    {
      path: [[860, 100], [860, 140]],
    },
    {
      path: [[740, 320], [740, 460]],
    },
    {
      path: [
        [1060, 420], [1060, 460], [860, 460],
      ],
    },
    {
      path: [[860, 460], [860, 420]],
    },
    {
      path: [[860, 220], [860, 280]],
    },
    {
      path: [[1060, 220], [1060, 280]],
    },
    {
      path: [[920, 280], [860, 280]],
    },
    {
      path: [[860, 280], [860, 340]],
    },
    {
      path: [[1000, 280], [1060, 280]],
    },
    {
      path: [[1060, 280], [1060, 340]],
    },
    {
      path: [[860, 100], [940, 100]],
    },
    {
      path: [
        [1160, 220], [1160, 280], [1060, 280],
      ],
    },
    {
      path: [[740, 480], [740, 460]],
    },
    {
      path: [[740, 460], [860, 460]],
    },
    {
      path: [[980, 100], [1060, 100]],
    },
    {
      path: [
        [1060, 100], [1160, 100], [1160, 140],
      ],
    },
  ],
};
