import { Direction } from '@circuit/algorithm';
import {
  ElectronicPrototype,
  ElectronicKind,
  ElectronicCategory,
  UnitType,
  PropertyKind,
} from '../types';

export const data: ElectronicPrototype = {
  pre: 'V',
  kind: ElectronicKind.DcVoltageSource,
  category: ElectronicCategory.Power,
  textBias: {
    Left: 24,
    Right: 24,
  },
  margin: [50, 18, 50, 18],
  properties: [
    {
      name: '电压值',
      kind: PropertyKind.Number,
      unit: UnitType.Volt,
      visibleInPainter: true,
      default: {
        value: 12,
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
        d: 'M0,-40V-5M0,5V40M-16,-5H16M-10.5,5H10.5M-10,-12H-5M-7.5,-15V-9',
        stroke: 'currentColor',
        fill: 'transparent',
      },
    },
  ],
  focus: [
    {
      name: 'rect',
      attribute: {
        x: '-16',
        y: '-30',
        width: '32',
        height: '60',
      },
    },
  ],
};
