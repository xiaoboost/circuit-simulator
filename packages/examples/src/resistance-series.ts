import { Direction } from '@circuit/algorithm';
import { StoreData, ElectronicKind } from '@circuit/types';

export const data: StoreData = {
  version: '1.0.0',
  parts: [
    {
      kind: ElectronicKind.Resistance,
      referenceTag: '1',
      position: [1100, 160],
      rotate: [[0, 1], [-1, 0]],
      propertyValues: [
        {
          value: 1,
          rank: 'k',
        },
      ],
      textDirection: Direction.Right,
    },
    {
      kind: ElectronicKind.Resistance,
      referenceTag: '2',
      position: [1100, 320],
      rotate: [[0, 1], [-1, 0]],
      propertyValues: [
        {
          value: 1,
          rank: 'k',
        },
      ],
      textDirection: Direction.Right,
    },
    {
      kind: ElectronicKind.ReferenceGround,
      referenceTag: '1',
      position: [900, 420],
      rotate: [[1, 0], [0, 1]],
      propertyValues: [],
      textDirection: Direction.Center,
    },
    {
      kind: ElectronicKind.VoltageMeter,
      referenceTag: 'R1',
      position: [1180, 160],
      rotate: [[1, 0], [0, 1]],
      propertyValues: [],
      textDirection: Direction.Right,
    },
    {
      kind: ElectronicKind.DcCurrentSource,
      referenceTag: '1',
      position: [900, 180],
      rotate: [[1, 0], [0, 1]],
      propertyValues: [
        {
          value: 10,
          rank: 'm',
        },
      ],
      textDirection: Direction.Right,
    },
    {
      kind: ElectronicKind.DcVoltageSource,
      referenceTag: '2',
      position: [900, 300],
      rotate: [[1, 0], [0, 1]],
      propertyValues: [
        {
          value: 12,
        },
      ],
      textDirection: Direction.Right,
    },
    {
      kind: ElectronicKind.CurrentMeter,
      referenceTag: 'in',
      position: [1000, 100],
      rotate: [[1, 0], [0, 1]],
      propertyValues: [],
      textDirection: Direction.Top,
    },
  ],
  lines: [
    {
      path: [[1100, 120], [1100, 100]],
    },
    {
      path: [[1180, 200], [1180, 220], [1100, 220]],
    },
    {
      path: [[1100, 200], [1100, 220]],
    },
    {
      path: [[1100, 220], [1100, 280]],
    },
    {
      path: [[900, 400], [900, 380]],
    },
    {
      path: [[900, 140], [900, 100], [980, 100]],
    },
    {
      path: [[1020, 100], [1100, 100]],
    },
    {
      path: [[1100, 100], [1180, 100], [1180, 120]],
    },
    {
      path: [[900, 340], [900, 380]],
    },
    {
      path: [[900, 380], [1100, 380], [1100, 360]],
    },
    {
      path: [[900, 260], [900, 220]],
    },
  ],
};
