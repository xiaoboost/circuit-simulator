import { Direction } from '@circuit/algorithm';
import {
  ElectronicPrototype,
  ElectronicKind,
  ElectronicCategory,
  UnitType,
  PropertyKind,
} from '../types';

export const data: ElectronicPrototype = {
  pre: 'Q',
  kind: ElectronicKind.TransistorNPN,
  category: ElectronicCategory.Semiconductor,
  textBias: {
    Right: 16,
  },
  margin: [50, 30, 50, 30],
  properties: [
    {
      name: '电流放大倍数',
      kind: PropertyKind.Number,
      unit: UnitType.Space,
      visibleInPainter: false,
      ranks: [],
      default: {
        value: 100,
      },
    },
    {
      name: 'B极电阻',
      kind: PropertyKind.Number,
      unit: UnitType.Ohm,
      visibleInPainter: false,
      ranks: [],
      default: {
        value: 26,
      },
    },
    {
      name: 'BE饱和压降',
      kind: PropertyKind.Number,
      unit: UnitType.Volt,
      visibleInPainter: false,
      ranks: [],
      default: {
        value: 0.6,
      },
    },
    {
      name: 'CE饱和压降',
      kind: PropertyKind.Number,
      unit: UnitType.Volt,
      visibleInPainter: false,
      ranks: [],
      default: {
        value: 1,
      },
    },
  ],
  pins: [
    {
      position: [-20, 0],
      direction: Direction.Left,
    },
    {
      position: [20, -40],
      direction: Direction.Top,
    },
    {
      position: [20, 40],
      direction: Direction.Bottom,
    },
  ],
  shape: [
    {
      name: 'path',
      attribute: {
        d: 'M-20,0H0M0,-25V25M20,-40V-28L0,-12M0,12L20,28V40',
        stroke: 'currentColor',
        fill: 'transparent',
      },
    },
    {
      name: 'polygon',
      attribute: {
        fill: 'currentColor',
        stroke: 'currentColor',
        strokeWidth: '0',
        points: '0,0 -11,-6 -7,0 -11,6',
        transform: 'translate(18, 26.4) rotate(38.7)',
      },
    },
  ],
  focus: [
    {
      name: 'rect',
      attribute: {
        x: '-10',
        y: '-30',
        width: '30',
        height: '60',
      },
    },
  ],
};
