import { Direction } from '@circuit/algorithm';
import {
  type ElectronicPrototype,
  ElectronicKind,
  ElectronicCategory,
  UnitType,
  PropertyKind,
} from '@circuit/types';

export const data: ElectronicPrototype = {
  pre: 'C',
  kind: ElectronicKind.Capacitor,
  category: ElectronicCategory.Passive,
  textBias: {
    Top: 22,
    Bottom: 22,
  },
  margin: [
    18, 32, 18, 32,
  ],
  properties: [
    {
      name: '电容量',
      kind: PropertyKind.Number,
      visibleInPainter: true,
      unit: UnitType.Farad,
      default: {
        value: 100,
        rank: 'u',
      },
    },
  ],
  pins: [
    {
      position: [-40, 0],
      direction: Direction.Left,
    },
    {
      position: [40, 0],
      direction: Direction.Right,
    },
  ],
  shape: [
    {
      name: 'path',
      attribute: {
        d: 'M5,0H40M-40,0H-5M-5,-16V16M5,-16V16',
        stroke: 'currentColor',
        fill: 'transparent',
      },
    },
  ],
};
