import { Direction } from '@circuit/algorithm';
import { type StoreData, ElectronicKind } from '@circuit/types';

export const data: StoreData = {
  version: '1.0.0',
  parts: [
    {
      kind: ElectronicKind.Diode,
      referenceTag: '1',
      position: [700, 200],
      rotate: [[1, 0], [0, 1]],
      propertyValues: [
        {
          value: 0.7,
        },
        {
          value: 0.5,
        },
        {
          value: 0.2,
          rank: 'G',
        },
      ],
      textDirection: Direction.Left,
    },
    {
      kind: ElectronicKind.Diode,
      referenceTag: '2',
      position: [780, 200],
      rotate: [[1, 0], [0, 1]],
      propertyValues: [
        {
          value: 0.7,
        },
        {
          value: 0.5,
        },
        {
          value: 0.2,
          rank: 'G',
        },
      ],
      textDirection: Direction.Left,
    },
    {
      kind: ElectronicKind.Diode,
      referenceTag: '3',
      position: [700, 440],
      rotate: [[1, 0], [0, 1]],
      propertyValues: [
        {
          value: 0.7,
        },
        {
          value: 0.5,
        },
        {
          value: 0.2,
          rank: 'G',
        },
      ],
      textDirection: Direction.Left,
    },
    {
      kind: ElectronicKind.Diode,
      referenceTag: '4',
      position: [780, 440],
      rotate: [[1, 0], [0, 1]],
      propertyValues: [
        {
          value: 0.7,
        },
        {
          value: 0.5,
        },
        {
          value: 0.2,
          rank: 'G',
        },
      ],
      textDirection: Direction.Left,
    },
    {
      kind: ElectronicKind.AcVoltageSource,
      referenceTag: '1',
      position: [580, 320],
      rotate: [[1, 0], [0, 1]],
      propertyValues: [
        {
          value: 220,
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
      kind: ElectronicKind.Capacitor,
      referenceTag: '1',
      position: [900, 320],
      rotate: [[0, 1], [-1, 0]],
      propertyValues: [
        {
          value: 100,
          rank: 'u',
        },
      ],
      textDirection: Direction.Left,
    },
    {
      kind: ElectronicKind.Resistance,
      referenceTag: '1',
      position: [960, 320],
      rotate: [[0, 1], [-1, 0]],
      propertyValues: [
        {
          value: 2,
          rank: 'k',
        },
      ],
      textDirection: Direction.Right,
    },
    {
      kind: ElectronicKind.CurrentMeter,
      referenceTag: 'out',
      position: [840, 140],
      rotate: [[1, 0], [0, 1]],
      textDirection: Direction.Top,
    },
    {
      kind: ElectronicKind.VoltageMeter,
      referenceTag: 'out',
      position: [1040, 320],
      rotate: [[1, 0], [0, 1]],
      textDirection: Direction.Right,
    },
    {
      kind: ElectronicKind.VoltageMeter,
      referenceTag: 'in',
      position: [640, 320],
      rotate: [[1, 0], [0, 1]],
      textDirection: Direction.Right,
    },
    {
      kind: ElectronicKind.ReferenceGround,
      referenceTag: '1',
      position: [700, 540],
      rotate: [[1, 0], [0, 1]],
      textDirection: Direction.Center,
    },
  ],
  lines: [
    {
      path: [
        [580, 280], [580, 260], [640, 260],
      ],
    },
    {
      path: [
        [580, 360], [580, 380], [640, 380],
      ],
    },
    {
      path: [
        [700, 160], [700, 140], [780, 140],
      ],
    },
    {
      path: [
        [1040, 280], [1040, 140], [960, 140],
      ],
    },
    {
      path: [
        [1040, 360], [1040, 500], [960, 500],
      ],
    },
    {
      path: [[780, 240], [780, 380]],
    },
    {
      path: [[780, 380], [780, 400]],
    },
    {
      path: [[700, 400], [700, 260]],
    },
    {
      path: [[700, 260], [700, 240]],
    },
    {
      path: [[960, 280], [960, 140]],
    },
    {
      path: [[780, 480], [780, 500]],
    },
    {
      path: [[700, 480], [700, 500]],
    },
    {
      path: [[780, 500], [900, 500]],
    },
    {
      path: [[960, 360], [960, 500]],
    },
    {
      path: [[900, 360], [900, 500]],
    },
    {
      path: [[860, 140], [900, 140]],
    },
    {
      path: [[900, 280], [900, 140]],
    },
    {
      path: [[820, 140], [780, 140]],
    },
    {
      path: [[780, 140], [780, 160]],
    },
    {
      path: [[960, 140], [900, 140]],
    },
    {
      path: [[960, 500], [900, 500]],
    },
    {
      path: [[640, 280], [640, 260]],
    },
    {
      path: [[640, 260], [700, 260]],
    },
    {
      path: [[640, 360], [640, 380]],
    },
    {
      path: [[640, 380], [780, 380]],
    },
    {
      path: [[700, 520], [700, 500]],
    },
    {
      path: [[700, 500], [780, 500]],
    },
  ],
};
