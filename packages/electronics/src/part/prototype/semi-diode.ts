import { Direction } from '@circuit/algorithm';
import {
  ElectronicPrototype,
  ElectronicKind,
  ElectronicCategory,
  UnitType,
  PropertyKind,
} from '@circuit/types';

export const data: ElectronicPrototype = {
  pre: 'VD',
  kind: ElectronicKind.Diode,
  category: ElectronicCategory.Semiconductor,
  textBias: {
    Left: 18,
    Right: 18,
  },
  margin: [32, 18, 32, 18],
  properties: [
    {
      name: '导通电压',
      kind: PropertyKind.Number,
      unit: UnitType.Volt,
      visibleInPainter: false,
      ranks: ['', 'm'],
      default: {
        value: 0.7,
      },
    },
    {
      name: '导通电阻',
      kind: PropertyKind.Number,
      unit: UnitType.Ohm,
      visibleInPainter: false,
      ranks: ['', 'm'],
      default: {
        value: 0.5,
      },
    },
    {
      name: '关断电阻',
      kind: PropertyKind.Number,
      unit: UnitType.Ohm,
      visibleInPainter: false,
      ranks: ['G', 'M', 'k', ''],
      default: {
        value: 5,
        rank: 'M',
      },
    },
  ],
  pins: [
    {
      position: [0, -40],
      direction: Direction.Top,
    },
    {
      position: [0, 40],
      direction: Direction.Bottom,
    },
  ],
  shape: [
    {
      name: 'path',
      attribute: {
        d: 'M0,-40V40M-13,-11H13',
        stroke: 'currentColor',
        fill: 'transparent',
      },
    },
    {
      name: 'polygon',
      attribute: {
        points: '0,-11 -13,11 13,11',
        fill: 'currentColor',
        stroke: 'currentColor',
      },
    },
  ],
};
