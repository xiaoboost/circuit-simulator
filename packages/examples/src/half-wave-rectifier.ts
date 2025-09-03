import { Direction } from '@circuit/algorithm';
import { type StoreData, ElectronicKind } from '@circuit/types';

export const data: StoreData = {
  version: '1.0.0',
  parts: [
    {
      kind: ElectronicKind.AcVoltageSource,
      referenceTag: '1',
      position: [540, 220],
      rotate: [[1, 0], [0, 1]],
      propertyValues: [
        {
          value: 25,
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
      kind: ElectronicKind.Diode,
      referenceTag: '1',
      position: [680, 140],
      rotate: [[0, 1], [-1, 0]],
      propertyValues: [
        {
          value: 1,
        },
        {
          value: 0.5,
        },
        {
          value: 0.2,
          rank: 'G',
        },
      ],
      textDirection: Direction.Top,
    },
    {
      kind: ElectronicKind.Resistance,
      referenceTag: '1',
      position: [860, 220],
      rotate: [[0, 1], [-1, 0]],
      propertyValues: [
        {
          value: 100,
        },
      ],
      textDirection: Direction.Left,
    },
    {
      kind: ElectronicKind.ReferenceGround,
      referenceTag: '1',
      position: [720, 340],
      rotate: [[1, 0], [0, 1]],
      textDirection: Direction.Center,
    },
    {
      kind: ElectronicKind.CurrentMeter,
      referenceTag: 'out',
      position: [800, 140],
      rotate: [[1, 0], [0, 1]],
      textDirection: Direction.Top,
    },
    {
      kind: ElectronicKind.VoltageMeter,
      referenceTag: 'in',
      position: [600, 220],
      rotate: [[1, 0], [0, 1]],
      textDirection: Direction.Right,
    },
    {
      kind: ElectronicKind.VoltageMeter,
      referenceTag: 'out',
      position: [920, 220],
      rotate: [[1, 0], [0, 1]],
      textDirection: Direction.Right,
    },
  ],
  lines: [
    {
      path: [
        [540, 180], [540, 140], [600, 140],
      ],
    },
    {
      path: [[600, 180], [600, 140]],
    },
    {
      path: [[600, 140], [640, 140]],
    },
    {
      path: [[720, 140], [780, 140]],
    },
    {
      path: [[820, 140], [860, 140]],
    },
    {
      path: [
        [920, 180], [920, 140], [860, 140],
      ],
    },
    {
      path: [[860, 140], [860, 180]],
    },
    {
      path: [
        [540, 260], [540, 300], [600, 300],
      ],
    },
    {
      path: [[600, 260], [600, 300]],
    },
    {
      path: [[600, 300], [720, 300]],
    },
    {
      path: [[720, 320], [720, 300]],
    },
    {
      path: [[720, 300], [860, 300]],
    },
    {
      path: [
        [920, 260], [920, 300], [860, 300],
      ],
    },
    {
      path: [[860, 300], [860, 260]],
    },
  ],
};
