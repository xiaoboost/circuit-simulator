import { Direction } from '@circuit/algorithm';
import { type StoreData, ElectronicKind } from '@circuit/types';

export const data: StoreData = {
  version: '1.0.0',
  parts: [
    {
      kind: ElectronicKind.DcVoltageSource,
      referenceTag: 'bias',
      position: [620, 100],
      rotate: [[0, 1], [-1, 0]],
      propertyValues: [
        {
          value: 20,
        },
      ],
      textDirection: Direction.Bottom,
    },
    {
      kind: ElectronicKind.ReferenceGround,
      referenceTag: '1',
      position: [540, 100],
      rotate: [[0, 1], [-1, 0]],
      propertyValues: [],
      textDirection: Direction.Center,
    },
    {
      kind: ElectronicKind.Resistance,
      referenceTag: '1',
      position: [700, 180],
      rotate: [[0, 1], [-1, 0]],
      propertyValues: [
        {
          value: 100,
          rank: 'k',
        },
      ],
      textDirection: Direction.Left,
    },
    {
      kind: ElectronicKind.Resistance,
      referenceTag: '2',
      position: [700, 380],
      rotate: [[0, 1], [-1, 0]],
      propertyValues: [
        {
          value: 100,
          rank: 'k',
        },
      ],
      textDirection: Direction.Left,
    },
    {
      kind: ElectronicKind.Resistance,
      referenceTag: '3',
      position: [800, 160],
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
      referenceTag: '4',
      position: [800, 400],
      rotate: [[0, 1], [-1, 0]],
      propertyValues: [
        {
          value: 2,
          rank: 'k',
        },
      ],
      textDirection: Direction.Left,
    },
    {
      kind: ElectronicKind.TransistorNPN,
      referenceTag: '1',
      position: [780, 280],
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
      kind: ElectronicKind.Resistance,
      referenceTag: '5',
      position: [1000, 340],
      rotate: [[0, 1], [-1, 0]],
      propertyValues: [
        {
          value: 1,
          rank: 'M',
        },
      ],
      textDirection: Direction.Left,
    },
    {
      kind: ElectronicKind.Capacitor,
      referenceTag: '1',
      position: [900, 220],
      rotate: [[1, 0], [0, 1]],
      propertyValues: [
        {
          value: 10,
          rank: 'n',
        },
      ],
      textDirection: Direction.Bottom,
    },
    {
      kind: ElectronicKind.Capacitor,
      referenceTag: '2',
      position: [640, 280],
      rotate: [[1, 0], [0, 1]],
      propertyValues: [
        {
          value: 10,
          rank: 'μ',
        },
      ],
      textDirection: Direction.Top,
    },
    {
      kind: ElectronicKind.AcVoltageSource,
      referenceTag: '2',
      position: [520, 360],
      rotate: [[1, 0], [0, 1]],
      propertyValues: [
        {
          value: 3,
        },
        {
          value: 300,
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
      referenceTag: 'in',
      position: [580, 360],
      rotate: [[1, 0], [0, 1]],
      propertyValues: [],
      textDirection: Direction.Right,
    },
    {
      kind: ElectronicKind.VoltageMeter,
      referenceTag: 'out',
      position: [1060, 340],
      rotate: [[1, 0], [0, 1]],
      propertyValues: [],
      textDirection: Direction.Right,
    },
    {
      kind: ElectronicKind.ReferenceGround,
      referenceTag: '2',
      position: [520, 500],
      rotate: [[1, 0], [0, 1]],
      propertyValues: [],
      textDirection: Direction.Center,
    },
  ],
  lines: [
    {
      path: [[560, 100], [580, 100]],
    },
    {
      path: [[660, 100], [700, 100]],
    },
    {
      path: [
        [800, 120], [800, 100], [700, 100],
      ],
    },
    {
      path: [[700, 140], [700, 100]],
    },
    {
      path: [[800, 240], [800, 220]],
    },
    {
      path: [[800, 320], [800, 360]],
    },
    {
      path: [[700, 220], [700, 280]],
    },
    {
      path: [[700, 340], [700, 280]],
    },
    {
      path: [[700, 280], [760, 280]],
    },
    {
      path: [[940, 220], [1000, 220]],
    },
    {
      path: [
        [1060, 300], [1060, 220], [1000, 220],
      ],
    },
    {
      path: [[1000, 220], [1000, 300]],
    },
    {
      path: [[860, 220], [800, 220]],
    },
    {
      path: [[800, 220], [800, 200]],
    },
    {
      path: [[680, 280], [700, 280]],
    },
    {
      path: [[580, 320], [580, 280]],
    },
    {
      path: [
        [520, 320], [520, 280], [580, 280],
      ],
    },
    {
      path: [[580, 280], [600, 280]],
    },
    {
      path: [[520, 480], [520, 460]],
    },
    {
      path: [[580, 400], [580, 460]],
    },
    {
      path: [[520, 400], [520, 460]],
    },
    {
      path: [[700, 420], [700, 460]],
    },
    {
      path: [[580, 460], [520, 460]],
    },
    {
      path: [[800, 440], [800, 460]],
    },
    {
      path: [[700, 460], [580, 460]],
    },
    {
      path: [[1000, 380], [1000, 460]],
    },
    {
      path: [[800, 460], [700, 460]],
    },
    {
      path: [
        [1060, 380], [1060, 460], [1000, 460],
      ],
    },
    {
      path: [[1000, 460], [800, 460]],
    },
  ],
};
