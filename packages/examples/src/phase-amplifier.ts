import { Direction } from '@circuit/algorithm';
import { type StoreData, ElectronicKind } from '@circuit/types';

export const data: StoreData = {
  version: '1.0.0',
  parts: [
    {
      kind: ElectronicKind.AcVoltageSource,
      referenceTag: '1',
      position: [660, 240],
      rotate: [[0, 1], [-1, 0]],
      propertyValues: [
        {
          value: 10,
        },
        {
          value: 200,
        },
        {
          value: 0,
        },
        {
          value: 0,
        },
      ],
      textDirection: Direction.Bottom,
    },
    {
      kind: ElectronicKind.OperationalAmplifier,
      referenceTag: '1',
      position: [900, 220],
      rotate: [[1, 0], [0, 1]],
      propertyValues: [
        {
          value: 120,
        },
        {
          value: 80,
          rank: 'M',
        },
        {
          value: 40,
        },
      ],
      textDirection: Direction.Left,
    },
    {
      kind: ElectronicKind.Resistance,
      referenceTag: '1',
      position: [780, 240],
      rotate: [[1, 0], [0, 1]],
      propertyValues: [
        {
          value: 10,
          rank: 'k',
        },
      ],
      textDirection: Direction.Bottom,
    },
    {
      kind: ElectronicKind.ReferenceGround,
      referenceTag: '1',
      position: [560, 240],
      rotate: [[0, 1], [-1, 0]],
      textDirection: Direction.Center,
    },
    {
      kind: ElectronicKind.VoltageMeter,
      referenceTag: 'in',
      position: [720, 320],
      rotate: [[1, 0], [0, 1]],
      textDirection: Direction.Right,
    },
    {
      kind: ElectronicKind.ReferenceGround,
      referenceTag: '2',
      position: [720, 420],
      rotate: [[1, 0], [0, 1]],
      textDirection: Direction.Center,
    },
    {
      kind: ElectronicKind.Resistance,
      referenceTag: '2',
      position: [900, 140],
      rotate: [[1, 0], [0, 1]],
      propertyValues: [
        {
          value: 10,
          rank: 'k',
        },
      ],
      textDirection: Direction.Top,
    },
    {
      kind: ElectronicKind.Resistance,
      referenceTag: '3',
      position: [780, 200],
      rotate: [[1, 0], [0, 1]],
      propertyValues: [
        {
          value: 10,
          rank: 'k',
        },
      ],
      textDirection: Direction.Top,
    },
    {
      kind: ElectronicKind.ReferenceGround,
      referenceTag: '3',
      position: [700, 200],
      rotate: [[0, 1], [-1, 0]],
      textDirection: Direction.Center,
    },
    {
      kind: ElectronicKind.Resistance,
      referenceTag: '4',
      position: [960, 320],
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
      kind: ElectronicKind.VoltageMeter,
      referenceTag: 'out',
      position: [1020, 320],
      rotate: [[1, 0], [0, 1]],
      textDirection: Direction.Right,
    },
  ],
  lines: [
    {
      path: [[580, 240], [620, 240]],
    },
    {
      path: [[740, 240], [720, 240]],
    },
    {
      path: [[860, 240], [820, 240]],
    },
    {
      path: [[720, 280], [720, 240]],
    },
    {
      path: [[720, 240], [700, 240]],
    },
    {
      path: [[720, 400], [720, 380]],
    },
    {
      path: [[740, 200], [720, 200]],
    },
    {
      path: [[860, 200], [840, 200]],
    },
    {
      path: [
        [860, 140], [840, 140], [840, 200],
      ],
    },
    {
      path: [[840, 200], [820, 200]],
    },
    {
      path: [
        [940, 140], [960, 140], [960, 220],
      ],
    },
    {
      path: [[960, 280], [960, 220]],
    },
    {
      path: [[960, 220], [940, 220]],
    },
    {
      path: [[960, 360], [960, 380]],
    },
    {
      path: [[720, 380], [720, 360]],
    },
    {
      path: [
        [1020, 280], [1020, 220], [960, 220],
      ],
    },
    {
      path: [
        [1020, 360], [1020, 380], [960, 380],
      ],
    },
    {
      path: [[960, 380], [720, 380]],
    },
  ],
};
