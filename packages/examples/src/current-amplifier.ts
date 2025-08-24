import { Direction } from '@circuit/algorithm';
import { StoreData, ElectronicKind } from '@circuit/types';

export const data: StoreData = {
  version: '1.0.0',
  parts: [
    {
      kind: ElectronicKind.DcVoltageSource,
      referenceTag: '1',
      position: [580, 280],
      rotate: [[0, 1], [-1, 0]],
      propertyValues: [
        {
          value: 10,
        },
      ],
      textDirection: Direction.Top,
    },
    {
      kind: ElectronicKind.Resistance,
      referenceTag: '1',
      position: [700, 280],
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
      kind: ElectronicKind.TransistorNPN,
      referenceTag: '1',
      position: [880, 280],
      rotate: [[1, 0], [0, 1]],
      propertyValues: [
        {
          value: 40,
        },
        {
          value: 26,
        },
        {
          value: 0.6,
        },
        {
          value: 1,
        },
      ],
      textDirection: Direction.Right,
    },
    {
      kind: ElectronicKind.ReferenceGround,
      referenceTag: '1',
      position: [500, 280],
      rotate: [[0, 1], [-1, 0]],
      propertyValues: [],
      textDirection: Direction.Center,
    },
    {
      kind: ElectronicKind.Resistance,
      referenceTag: '2',
      position: [900, 400],
      rotate: [[0, 1], [-1, 0]],
      propertyValues: [
        {
          value: 100,
        },
      ],
      textDirection: Direction.Left,
    },
    {
      kind: ElectronicKind.CurrentMeter,
      referenceTag: 'in',
      position: [800, 280],
      rotate: [[1, 0], [0, 1]],
      propertyValues: [],
      textDirection: Direction.Top,
    },
    {
      kind: ElectronicKind.CurrentMeter,
      referenceTag: 'ap',
      position: [740, 200],
      rotate: [[1, 0], [0, 1]],
      propertyValues: [],
      textDirection: Direction.Top,
    },
    {
      kind: ElectronicKind.ReferenceGround,
      referenceTag: '2',
      position: [900, 480],
      rotate: [[1, 0], [0, 1]],
      propertyValues: [],
      textDirection: Direction.Center,
    },
  ],
  lines: [
    {
      path: [[520, 280], [540, 280]],
    },
    {
      path: [[620, 280], [640, 280]],
    },
    {
      path: [[900, 360], [900, 320]],
    },
    {
      path: [[820, 280], [860, 280]],
    },
    {
      path: [[780, 280], [740, 280]],
    },
    {
      path: [[760, 200], [900, 200], [900, 240]],
    },
    {
      path: [[720, 200], [640, 200], [640, 280]],
    },
    {
      path: [[640, 280], [660, 280]],
    },
    {
      path: [[900, 440], [900, 460]],
    },
  ],
};
